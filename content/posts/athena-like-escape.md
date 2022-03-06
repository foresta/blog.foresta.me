+++
title="Athena (Presto) の LIKE 検索で文字をエスケープする"
date="2022-03-06T18:53:15+09:00"
categories = ["engineering"]
tags = ["athena", "presto", "sql", "like", "escape"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Athena で LIKE 検索するときに検索したい文字列をエスケープする方法について調べたのでまとめます。

## 対象のクエリ

以下のようなクエリから `%` を持つテキストを探し出したいようなユースケースを考えます。

```sql
WITH
dataset AS (
    SELECT *
    FROM (
        VALUES 'aaa_%aaa', 'bbbbbb', 'cccccc@#$%^&*()^cc'
    ) as t("text")
)
SELECT
    *
FROM dataset
```

| text |
| --- |
| aaa_%aaa |
| bbbbbb |
| cccccc@#$%^&*()^cc |

## ESCAPE characterを指定する

普通に検索しようとすると、`%` が LIKE の Wildcard として予約されているので検索することができません。

そのため、Presto には ESCAPE character を指定する構文が用意されています。
以下は、`#` を ESCAPE character として使用する例です。


```sql
WITH
dataset AS (
    SELECT *
    FROM (
        VALUES 'aaa_%aaa', 'bbbbbb', 'cccccc@#$%^&*()^cc'
    ) as t("text")
)
SELECT
    *
FROM dataset
WHERE "text" LIKE '%#%%' ESCAPE '#'
```

以下のように正しく実行することができます。

| text |
| --- |
| aaa_%aaa |
| cccccc@#$%^&*()^cc |

## 全記号を検索したいなどの特殊ケース

上記の方法で、大体のケースはカバーできると思いますが例えば、検索したい文字が複数あって他のテーブルに格納されているなどといったケースではもう少し考慮が必要です。

```sql
WITH
dataset AS (
    SELECT *
    FROM (
        VALUES 'aaa_%aaa', 'bbbbbb', 'cccccc@#$%^&*()^cc'
    ) as t("text")
),
symbol_data AS (
    SELECT ARRAY ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'] as symbols
),
data_with_symbols AS (
    SELECT
        *,
        (SELECT symbols FROM symbol_data LIMIT 1) as symbols
    FROM dataset
)
SELECT 
    *,
    filter(symbols, s -> "text" LIKE '%' || s || '%') as hit
FROM data_with_symbols
WHERE cardinality(filter(symbols, s -> "text" LIKE '%' || s || '%')) > 0
```

上記は symbol_data というテーブルに格納されている記号で検索するようなケースを想定しています。

以下の部分は、配列に格納されている記号データを `"text"` フィールドに含まれているものだけ `filter` してその件数が 0 件以上という条件を WHERE 句で指定しています。

記号が一つでも含まれていたら true となるような指定です。

```sql
WHERE cardinality(filter(symbols, s -> "text" LIKE '%' || s || '%')) > 0
```

上記のクエリは、まだエスケープしていないのでうまく動かず全件がヒットします。

| text | symbols | hit |
| --- | --- | --- |
| aaa_%aaa | '!', '@', '#', '$', '%', '^', '&', '*', '(', ')' | '%' |
| bbbbbb | '!', '@', '#', '$', '%', '^', '&', '*', '(', ')' | '%' |
| cccccc@#$%^&*()^cc |'!', '@', '#', '$', '%', '^', '&', '*', '(', ')' | '@', '#', '$', '%', '^', '*', '(', ')' |

`hit` field に、検索に引っかかった symbol を出していますが `%` が wildcard のため全データに hit してしまっています。

今回のように、symbol が固定であれば symbol_data テーブルに入ることのない文字を ESCAPE character に指定してしまえば良いですが、もしその文字がテーブルに入ってしまうと途端にこのクエリは動かなくなってしまいます。

## regexp_like と `\Q` `\E` でエスケープする。

以下のように、regexp_like と `\Q`, `\E` を用いると `\Q` から `\E` までの間を全てエスケープすることができます。

```sql
SELECT 
    *,
    filter(symbols, s -> regexp_like("text", '\Q' || s || '\E')) as hit
FROM data_with_symbols
WHERE cardinality(filter(symbols, s -> regexp_like("text", '\Q' || s || '\E'))) > 0
```

LIKE 句でも使えるかと思い試してみましたが、手元の環境だと動かなそうでした。

上記を実行すると期待通り以下のような結果になりました。

| text | symbols | hit |
| --- | --- | --- |
| aaa_%aaa | '!', '@', '#', '$', '%', '^', '&', '*', '(', ')' | '%' |
| cccccc@#$%^&*()^cc |'!', '@', '#', '$', '%', '^', '&', '*', '(', ')' | '@', '#', '$', '%', '^', '*', '(', ')' |

## まとめ

今回は、Athena (Presto) で LIKE 検索する際のエスケープの方法についてまとめました。
特に一番最後の、`\Q` と `\E` でエスケープする方法は知りませんでした。

この記事で紹介したような特殊ケースなどではこの方法でエスケープすると良さそうだなと思ったので、この記事を備忘録としようと思います。

