+++
title="Snowflake の SQL Tips"
date="2025-01-26T22:39:56+09:00"
categories = ["engineering"]
tags = ["snowflake", "sql", "tips"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Snowflake の SQL を書いてる時に、調べて便利だった Tips をまとめます。

## EQUAL_NULL

Snowflake では、`=` 演算子で値を比較できますが値が null の場合は結果も null になります。
null どうしなどを比較したい場合は、`EQUAL_NULL` 関数が便利です。

```sql
select 
    'hoge' = 'hoge'
    , 'hoge' = null
    , null = 'hoge'
    , null = null
    , equal_null('hoge', 'hoge')
    , equal_null('hoge', null)
    , equal_null(null, 'hoge')
    , equal_null(null, null)
    
```

結果は以下のようになります。


|'HOGE' = 'HOGE' | 'HOGE' = NULL | NULL = 'HOGE' | NULL = NULL | EQUAL_NULL('HOGE', 'HOGE') | EQUAL_NULL('HOGE', NULL) | EQUAL_NULL(NULL, 'HOGE') | EQUAL_NULL(NULL, NULL) |
|----------------|---------------|---------------|-------------|-----------------------------|---------------------------|---------------------------|-------------------------|
|TRUE | null | null | null | TRUE | FALSE | FALSE | TRUE |

null どうしの比較などを行うことができます。

## ARRAY_UNIQUE_AGG

`ARRAY_AGG` 関数を使うと、グループ化した結果を配列で取得できますが、重複を取り除く `ARRAY_UNIQUE_AGG` 関数が便利です。

```sql
select
    group_key
    , array_agg(value) as non_unique_arr
    , array_distinct(array_agg(value)) as unique_arr
    , arrray_unique_agg(value) as unique_arr2
from table_name
group by 1
```

今まで `ARRAY_UNIQUE_AGG` 関数は存在を知らなかったので、`ARRAY_DISTINCT` も使っていましたがこちらの方が便利です。

## TRANSFORM, REDUCE

いわゆる、map と reduce 関数です。

これらの関数があると大体の配列処理が書けるので覚えておくと便利です。

(例は後ほど)

## MAP_CAT

Snowflake には Key Value の Map 型がありますが、`MAP_CAT` 関数を使うと、Map どうしを連結することができます。

前述の `TRANSFORM`, `REDUCE` と組み合わせると、URL のクエリパラメータをパースする処理が書けます。

```sql
select
    'https://example.com?hoge=1&fuga=2' as url
    , reduce(
        transform(
            -- ? で分割した後半部分を & で分割
            split(split(url, '?')[1], '&') 
            -- a=1 などの文字列を = で分割し OBJECT 型にする
            -- & で分割した配列のそれぞれの部分に対して処理を行うため transform
            , a VARCHAR -> object_construct(to_varchar(split(a, '=')[0]), split(a, '=')[1])
        )
        , {}::map(varchar, varchar)
        -- map_cat で map 同士を連結
        , (m1, m2) -> map_cat(m1, m2::map(varchar, varchar))
    ) as parsed
    , parsed['hoge'] as hoge -- => 1
    , parsed['fuga'] as hoge -- => 2
```


## まとめ

今回は最近お世話になった、Snowflake の SQL の Tips をまとめました。
Snowflake 自体は 1年使ってましたが新しく知ることがありました。これらをつかうと便利に SQL が書けそうで良さそうです。
