+++
title="materialized = table で dbt run のパフォーマンスを改善する"
date="2025-02-17T01:04:03+09:00"
categories = ["engineering"]
tags = ["dbt", "data-engineering"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段 dbt でデータ変換を実装しているのですが、データモデルで重い処理があると dbt run の実行時間が増えてきます。


## 重い処理

dbt でモデルを構築していたのですが、SQL で URL に含まれるクエリパラメータをパースするような処理が重かったです。

具体的には以下のような SQL です。

```sql
with raw_data as (
    select
        id,
        url
    from {{ ref('source_table') }}
)
select
    id,
    url,

    -- パラメータ foo の値を抽出するための正規表現
    regexp_extract(url, '.*[?&]foo=([^&]+)', 1) as foo_value,
    -- パラメータ bar の値を抽出するための正規表現

    regexp_extract(url, '.*[?&]bar=([^&]+)', 1) as bar_value
from raw_data
```


このモデルが、後続の様々なモデルから参照されていたのですが処理が重く dbt run に 30 分位かかっていました。
正規表現を使うのは CPU ヘビーな処理になりやすくボトルネックになりやすいのでここを改善しようとしました。

## materialized = table で高速化

問題は、dbt のデフォルトの materialize が view になっていることです。

後続のモデルから複数参照されるモデルのため、view 担っている場合参照されるたびに正規表現によるパース処理が走ります。
パースは一度で良かったので、materialize = table にすることで高速化を試みました。


やり方は簡単で、SQL の先頭に以下のような config を書くだけでよいです。

```sql
{{ config(
    materialized='table'
) }}

with raw_data as (
    select
        id,
        url
    from {{ ref('source_table') }}
)
select
    id,
    url,

    -- パラメータ foo の値を抽出するための正規表現
    regexp_extract(url, '.*[?&]foo=([^&]+)', 1) as foo_value,
    -- パラメータ bar の値を抽出するための正規表現

    regexp_extract(url, '.*[?&]bar=([^&]+)', 1) as bar_value
from raw_data
```


このようにすると一度パースされたパラメータがテーブルに保持されるため正規表現の処理が複数回走らなくなりその結果として実行時間を大幅に減らすことができました。
具体的には、30 分かかっていたところが 3 分ほどになりました。

今回の様な計算コストが高い処理などを行う場合 materialization を table にすることで高速化が期待できます。ただし、データをリアルタイムで反映したいようなケースの場合テーブルだと dbt run が走ったタイミングでしか同期されないため注意が必要です。

基本的な方針としては、基本は view で処理の高速化を図りたいケースに table を採用すると良さそうです。

## まとめ

今回は、dbt の materialization を table にすることで重い処理を高速化することを紹介しました。
dbt の実行時間は最終的にワークフローの実行時間につながり、ここが早いと開発の生産性なども向上するため遅いものは積極的に高速化していこうと思います。
