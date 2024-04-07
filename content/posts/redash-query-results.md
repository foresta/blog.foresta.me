+++
title="Redash の Query Results について"
date="2024-04-07T12:56:28+09:00"
categories = ["engineering"]
tags = ["redash", "bi", "sql"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は Redash の Query Results についてまとめます。

## Redash の Query Results

Redash は OSS の BI ツールで、各種データソースと接続して SQL を書いたり簡単にグラフなどの Visualize を作成したりできるツールです。

Redash には Query Results という仕組みがあります。

-   {{< exlink href="https://redash.io/help/user-guide/querying/query-results-data-source" >}}

Query Results は、Redash 上で作成されたデータをソースとしてクエリをかける仕組みです。

Redash ではクエリを作成すると ID が振られるのですが、このクエリ同士を JOIN してクエリを書くことが出来ます。

```sql
SELECT
  a.name,
  b.category
FROM query_100 as a
JOIN query_500 as b
  ON a.id = b.id
```

上記は、queryID が 100 のクエリ結果と、500 の結果を JOIN している例です。
`query_{queryID}` というテーブル名で参照することが出来ます。

Redash のクエリ結果を JOIN するので、別データソース（例えば MySQL と Snowflake のテーブル）を JOIN するといったことが出来ます。

## SQLite

注意点として、Redash の Query Results で書く SQL は SQLite になります。

SQL は方言によって少しずつ挙動が違うので注意が必要です。

## キャッシュ

キャッシュされたクエリをデータソースにすることも出来ます。

```sql
SELECT
  a.name,
  b.category
FROM cached_query_100 as a
JOIN query_500 as b
  ON a.id = b.id
```

prefix で `cached_` と付けるとキャッシュされたデータソースから参照することができ、クエリを高速化することができます。

## Query Parameter について

注意点として、Redash で Query Parameter を使用したクエリを Query Results の Data Source として使用することはできないです。

Query Parameter のよくあるユースケースとして、任意の日付を絞ってクエリするということが想定されますが Redash 本体ではサポートされていません。

この点は注意が必要です。

## まとめ

今回は、Redash の Query Results について書きました。
ハマりどころもあるので注意が必要ですが、便利な機能です。

余談ですが、`Redash` は昔 `re:dash` という名前になっていてリネームされたそうです。

-   {{< exlink href="https://github.com/mozilla/redash_client/pull/72" text="Rename all re:dash to Redash #72" >}}
