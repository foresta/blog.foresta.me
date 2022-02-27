+++
title="Athena (Presto) で配列の重複した要素を数える"
date="2022-02-27T17:08:11+09:00"
categories = ["engineering"]
tags = ["athena", "presto", "sql", "array"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Athena で配列の重複した要素数を数える方法をメモします。


## 対象のデータ

以下のような配列データを想定します。

```sql
with 
dataset as (
    select *
    from (
        VALUES 'A', 'B', 'C', 'D', 'E', 'B', 'C', 'D', 'A', 'A'
    ) as t("data")
) 
select array_agg("data") as list from dataset
```

| list |
| --- |
| {'A', 'B', 'C', 'D', 'E', 'B', 'C', 'D', 'A', 'A'} |

これを以下のように集計したいケースを考えます。

| key | count |
| --- | --- |
| 'A' | 3 |
| 'B' | 2 |
| 'C' | 2 |
| 'D' | 2 |
| 'E' | 1 |

## Presto の場合

`array_frequency` という関数が用意されているのでこれを利用すれば OK です。

- https://prestodb.io/docs/current/functions/array.html 

```sql
with 
dataset as (
    select *
    from (
        VALUES 'A', 'B', 'C', 'D', 'E', 'B', 'C', 'D', 'A', 'A'
    ) as t("data")
) 
select array_frequency(array_agg("data")) as list from dataset
```

ただし、こちらの関数は Athena では用意されてなく実行することができません。

```
Error running query: SYNTAX_ERROR: line 8:8: Function array_frequency not registered
```

そこでその他の配列関数を用いて同様の集計をします。

## Athena で実現する方法

以下のようなクエリで実現することができます。

```sql
with
 dataset as (
     SELECT *
     FROM (
         VALUES 'A', 'B', 'C', 'D', 'E', 'B', 'C', 'D', 'A', 'A'
     ) as t("data")
 ),
 frequencies as (
     select
         transform_values(
             multimap_from_entries(
                 transform(array_agg("data"), k -> ROW (k, 1))
             ),
             (k, v) -> cardinality(v)
         ) as list
     from dataset
 )
 select
     "key",
     "count"
 from frequencies
 cross join unnest(
     map_keys(list),
     map_values(list)
 ) as t("key", "count")
```

ちょっと長いので少しずつ解説します。

まず、transform で `ROW` 型のデータに変換します。`ROW (k, 1)` のような形式ですが、1 の方はなんでも良いかなと思います。

```sql
with
 dataset as (
     SELECT *
     FROM (
         VALUES 'A', 'B', 'C', 'D', 'E', 'B', 'C', 'D', 'A', 'A'
     ) as t("data")
 ),
select
    transform(array_agg("data"), k -> ROW (k, 1))
from dataset
```

以下のようなデータになります。

| list |
| --- |
|{ {field0=A, field1=1}, {field0=B, field1=1}, {field0=C, field1=1}, {field0=D, field1=1}, {field0=E, field1=1}, {field0=B, field1=1}, {field0=C, field1=1}, {field0=D, field1=1}, {field0=A, field1=1}, {field0=A, field1=1} }|

key value のペアっぽいデータができたのでこれを `multimap_from_entries` 関数を用いて MAP 型に変換します。

```sql
 with
 dataset as (
     SELECT *
     FROM (
         VALUES 'A', 'B', 'C', 'D', 'E', 'B', 'C', 'D', 'A', 'A'
     ) as t("data")
 )
 select
     multimap_from_entries(
         transform(array_agg("data"), k -> ROW (k, 1))
     )
 from dataset
```

これで以下のようなデータになります。

| list |
| --- |
|{A={1, 1, 1}, B={1, 1}, C={1, 1}, D={1, 1}, E={1}}|

このデータの values の要素数を数え上げれば、目的のデータが得られます。`cardinality` 関数で配列の要素数を取得できます。

```sql
 with
 dataset as (
     SELECT *
     FROM (
         VALUES 'A', 'B', 'C', 'D', 'E', 'B', 'C', 'D', 'A', 'A'
     ) as t("data")
 )
 select
         transform_values(
             multimap_from_entries(
                 transform(array_agg("data"), k -> ROW (k, 1))
             ),
             (k, v) -> cardinality(v)
         ) as list
 from dataset
```

| list |
| --- |
|{A=3, B=2, C=2, D=2, E=1}|

あとは、このデータを行に展開します。

行への展開は、[こちらの記事](/posts/athena-presto-expand-array/) でも紹介した、`CROSS JOIN UNNEST` を用います。

```sql
with
 dataset as (
     SELECT *
     FROM (
         VALUES 'A', 'B', 'C', 'D', 'E', 'B', 'C', 'D', 'A', 'A'
     ) as t("data")
 ),
 frequencies as (
     select
         transform_values(
             multimap_from_entries(
                 transform(array_agg("data"), k -> ROW (k, 1))
             ),
             (k, v) -> cardinality(v)
         ) as list
     from dataset
 )
 select
     "key",
     "count"
 from frequencies
 cross join unnest(
     map_keys(list),
     map_values(list)
 ) as t("key", "count")
```

`map_keys` と `map_values` でそれぞれ key と value を取り出して列にしています。

これで無事欲しかった集計をすることができました。

| key | count |
| --- | --- |
| 'A' | 3 |
| 'B' | 2 |
| 'C' | 2 |
| 'D' | 2 |
| 'E' | 1 |

## まとめ

今回は、Athena で用意されていない `array_frequency` の代わりに、配列の要素数を求める SQL を紹介しました。

たまに、Presto にあっても Athena では用意されていない関数があるので注意が必要ですが、基本的な (map, filter など) 配列関数は用意されているのでそれらを用いると大体の関数は書けるかなと思います。\
集計するクエリなどを書くときは配列操作周りの関数を知っておくと便利で良さそうです。

