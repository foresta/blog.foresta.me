+++
title="dbt の hook で UDF を作成する"
date="2025-02-02T21:15:52+09:00"
categories = ["engineering"]
tags = ["dbt", "data-engineering"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

dbt と Snowflake を使って開発をしていますが、Snowflake の UDF を作成する際に以前は {{< exlink href="https://github.com/Snowflake-Labs/schemachange" text="schemachage" >}} などで行ってましたが、dbt の `on-run-start` の hook を用いて管理する方法が良さそうだったのでメモします。

## on-run-start の hook で UDF を作成する

on-run-start は、dbt_project.yml ファイルで指定することができます。


```yml

on-run-start:
  - '{{ create_udf() }}'
```

以下のようなmacro を用意すると `dbt run` などの実行前に UDF を作成できます。

```sql
{% macro create_udf() %}
create or replace function encode_uri_component("STR" VARCHAR)
  RETURNS VARCHAR
  LANGUAGE JAVASCRIPT
  AS
$$
  return encodeURIComponent(STR)
$$;
{% endmacro %}
```

ちなみに、`on-run-start` は `dbt build`, `dbt compile`, `dbt docs generate`, `dbt run`, `dbt seed`, `dbt snapshot`, `dbt test` などの前に発火されるようです。

- {{< exlink href="https://docs.getdbt.com/reference/project-configs/on-run-start-on-run-end" >}}


## まとめ

今回は dbt の hook を使って UDF などを作る方法について書きました。
dbt 管理便利そうなのでしばらく運用しようとしてみようと思います。
