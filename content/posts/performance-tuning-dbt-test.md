+++
title="Custom Generic Test で dbt test を高速化した話"
date="2025-02-17T01:22:09+09:00"
categories = ["engineering"]
tags = ["dbt", "test", "data-engineering"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

dbt の Generic Test は非常に便利なためかなりヘビーに使ってますが test の量が増えてくるとどんどん test の実行時間が増えてきます。
test の実行時間が増えるとローカルで開発する際の生産性が下がるためできるだけ高速化したいです。

今回は Custom Generic Test を書くことで高速化することができたので紹介します。

## 対象の Generic Test

dbt には default で Generic Test が用意されています。

例えば以下のように、各カラムに対して not_null のテストを行うことができます。

```yml
version: 2

models:
  - name: my_model
    description: "サンプルデータセット。7つのカラムに対して not_null テストを実施します。"
    columns:
      - name: id
        description: "各レコードのユニークな識別子。常に値が存在する必要があります。"
        data_tests:
          - not_null
      - name: order_id
        description: "注文を識別するためのID。必ず値が存在する必要があります。"
        data_tests:
          - not_null
      - name: customer_id
        description: "顧客ID。各注文に紐づく顧客情報として必須です。"
        data_tests:
          - not_null
      - name: product_id
        description: "商品ID。注文に含まれる各商品の識別子です。"
        data_tests:
          - not_null
      - name: created_at
        description: "レコードが作成された日時。時間軸の整合性のために必須です。"
        data_tests:
          - not_null
      - name: updated_at
        description: "レコードが最後に更新された日時。必ず正しい値が必要です。"
        data_tests:
          - not_null
      - name: status
        description: "レコードの状態を示すカラム。NULL 値が含まれないことが求められます。"
        data_tests:
          - not_null
```

yaml に追加することで、not_null を保証するテストが実行できるので非常に便利です。

実際に利用される macro は以下のようなものです。

- {{< exlink href="https://github.com/dbt-labs/dbt-adapters/blob/6525e31d4814df3d20bab50fa5de578013c9ca20/dbt-adapters/src/dbt/include/global_project/macros/generic_test_sql/not_null.sql" text="https://github.com/dbt-labs/dbt-adapters/src/dbt/include/global_project/macros/generic_test_sql/not_null.sql" >}}

そしてこの Generic Test を実行すると以下のような SQL が対象のカラム分実行されます。

```sql
{% macro default__test_not_null(model, column_name) %}

{% set column_list = '*' if should_store_failures() else column_name %}


select {{ column_list }}
from {{ model }}
where {{ column_name }} is null

{% endmacro %}
```

上記の yaml の設定だと 7 回 SQL が投げられます。

## Custom Generic Test 

そこで not_null not チェックをまとめてやる Custom Generic Test を実装しました。

`tests/generic/not_null_multiple_columns.sql` という macro です。

```sql
{% test not_null_multiple_columns(model, columns) %}
SELECT *
FROM {{ model }}
WHERE
    {% for column in columns %}
        {{ column }} IS NULL {% if not loop.last %}OR {% endif %}
    {% endfor %}
{% endtest %}
```

これを以下のように使います。

```yml
version: 2

models:
  - name: my_model
    description: "サンプルデータセット。7つのカラムに対して not_null テストを実施します。"
    data_tests:
      - not_null_multiple_columns:
          columns:
            - id
            - order_id
            - customer_id
            - product_id
            - created_at
            - updated_at
            - status

    columns:
      - name: id
        description: "各レコードのユニークな識別子。常に値が存在する必要があります。"
      - name: order_id
        description: "注文を識別するためのID。必ず値が存在する必要があります。"
      - name: customer_id
        description: "顧客ID。各注文に紐づく顧客情報として必須です。"
      - name: product_id
        description: "商品ID。注文に含まれる各商品の識別子です。"
      - name: created_at
        description: "レコードが作成された日時。時間軸の整合性のために必須です。"
      - name: updated_at
        description: "レコードが最後に更新された日時。必ず正しい値が必要です。"
      - name: status
        description: "レコードの状態を示すカラム。NULL 値が含まれないことが求められます。"
```

このようにすると、テストの数が 7 つから 1 つに減り、実行時間も大幅に減らすことができます。

特に materialization が view のモデルに対して not_null などを実行すると view のコードが not_null テストをしたいカラム数分走るので実行時間を大幅に減らすことができました。

実際に特定の dbt_project 内に適用したところ test の実行時間が半分くらいになりました。

## まとめ

今回は、Custom Generic Test を実装することで、dbt test の時間を半分くらいまでに高速化した話を記載しました。
test が遅くなると、開発の生産性も落ちてくるので積極的に高速化していきたいと思います。
