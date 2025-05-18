+++
title="dbt_utilsでURLパラメータを抽出する方法"
date="2025-05-18T22:23:54+09:00"
categories = []
tags = []
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。


[以前の記事](/posts/performance-tuning-dbt-run/)で、dbtモデルでURLからクエリパラメータを抽出する際に正規表現を使った処理が重くなり、`materialized = table`で改善した話を書きました。今回は別のアプローチとして、`dbt_utils`パッケージの`get_url_parameter`マクロを使ってURLパラメータを抽出する方法について紹介します。

## dbt_utilsの導入

まず、dbt_utilsパッケージをプロジェクトに追加する必要があります。`packages.yml`ファイルをプロジェクトルートに作成し、以下の内容を記述します。

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1  # 執筆時点での最新バージョン
```

作成したら、以下のコマンドでパッケージをインストールします。

```bash
$ dbt deps
```

これでdbt_utilsのマクロが使えるようになりました。

## get_url_parameterマクロの基本的な使い方

`get_url_parameter`は、URLを含むカラムから特定のクエリパラメータを抽出するためのマクロです。使い方は非常にシンプルで、以下のような形式で呼び出します。

```sql
SELECT
  url,
  {{ dbt_utils.get_url_parameter(field='url', url_parameter='foo') }} AS foo_value,
  {{ dbt_utils.get_url_parameter(field='url', url_parameter='bar') }} AS bar_value
FROM {{ ref('source_table') }}
```

このクエリでは、`url`カラムから`foo`と`bar`というパラメータの値を抽出し、新しいカラムとして取得します。

## 以前の正規表現処理との比較

以前の記事で紹介した正規表現を使った方法と比較してみましょう。以前のコードは以下のようなものでした：

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

これを`dbt_utils`を使って書き直すと、以下のようになります：

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
  {{ dbt_utils.get_url_parameter(field='url', url_parameter='foo') }} as foo_value,
  {{ dbt_utils.get_url_parameter(field='url', url_parameter='bar') }} as bar_value
from raw_data
```

## 複数パラメータを一度に抽出する実践例

実際のプロジェクトでは、多数のパラメータを抽出したい場合があります。例えば、マーケティングキャンペーンのUTMパラメータをすべて抽出する場合、以下のようなモデルが考えられます：

```sql
{{ config(materialized='table') }}

with raw_data as (
  select
    event_id,
    timestamp,
    page_url
  from {{ ref('web_events') }}
)

select
  event_id,
  timestamp,
  page_url,
  {{ dbt_utils.get_url_parameter(field='page_url', url_parameter='utm_source') }} as utm_source,
  {{ dbt_utils.get_url_parameter(field='page_url', url_parameter='utm_medium') }} as utm_medium,
  {{ dbt_utils.get_url_parameter(field='page_url', url_parameter='utm_campaign') }} as utm_campaign,
  {{ dbt_utils.get_url_parameter(field='page_url', url_parameter='utm_content') }} as utm_content,
  {{ dbt_utils.get_url_parameter(field='page_url', url_parameter='utm_term') }} as utm_term
from raw_data
```

## その他のURL関連マクロ

`dbt_utils`には`get_url_parameter`以外にも、URLを処理するための便利なマクロがあります：

1. **get_url_host**: URLからホスト部分（ドメイン）を抽出
2. **get_url_path**: URLからパス部分を抽出

これらを組み合わせることで、URLの様々な部分を簡単に解析できます：

```sql
select
  page_url,
  {{ dbt_utils.get_url_host(field='page_url') }} as domain,
  {{ dbt_utils.get_url_path(field='page_url') }} as path,
  {{ dbt_utils.get_url_parameter(field='page_url', url_parameter='search_term') }} as search_term
from {{ ref('web_events') }}
```

## まとめ

`dbt_utils.get_url_parameter`を使うことで、URLからのパラメータ抽出が簡単かつ保守性の高いコードで実現できます。パフォーマンスを重視する場合は、前回紹介した`materialized = table`との組み合わせが効果的です。

また、`dbt_utils`にはURLパラメータの抽出以外にも、多数の便利なマクロが用意されています。SQL生成、テスト、Jinjaヘルパーなど様々な用途に使えるマクロが揃っているので、ぜひ公式ドキュメントやGitHubリポジトリを参照してみてください。

dbtを使ったデータ変換をより効率的に行うために、このようなユーティリティを活用していきます。
