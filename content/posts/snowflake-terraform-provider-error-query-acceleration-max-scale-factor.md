+++
title="Snowflake Terraform エラー対応: Invalid Property QUERY_ACCELERATION_MAX_SCALE_FACTOR"
date="2025-05-04T22:37:59+09:00"
categories = ["engineering"]
tags = ["snowflake", "terraform", "error"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Snowflake のリソース管理を Terraform で行っていますが、その際に発生したエラーについて対応方法をまとめます。

## エラー内容


以下のようなエラーが発生しました。

```text
│ Error: 001423 (22023): SQL compilation error:
│ invalid property 'QUERY_ACCELERATION_MAX_SCALE_FACTOR'; feature 'Query Acceleration Service' not enabled
│ 
│   with module.snowflake_warehouse.snowflake_warehouse.sample_warehouse,
│   on ../../modules/snowflake_warehouse/main.tf line 431, in resource "snowflake_warehouse" "sample_warehouse":
│  431: resource "snowflake_warehouse" "sample_warehouse" {
│
```

terraform のコード自体は以下のようになってました。

```hcl
resource "snowflake_warehouse" "sample_warehouse" {
  name                                = "SAMPLE_WAREHOUSE"
  warehouse_size                      = "XSMALL"
  auto_resume                         = true
  enable_query_acceleration           = "false"
  max_concurrency_level               = 8
  query_acceleration_max_scale_factor = 0
  auto_suspend                        = 60
  statement_queued_timeout_in_seconds = 3600
  statement_timeout_in_seconds        = 3600
  warehouse_type                      = "STANDARD"
}
```

## 解消方法

以下のような記述に変更しました。

```diff
resource "snowflake_warehouse" "sample_warehouse" {
  name                                = "SAMPLE_WAREHOUSE"
  warehouse_size                      = "XSMALL"
  auto_resume                         = true
-  enable_query_acceleration           = "false"
+  enable_query_acceleration           = false
  max_concurrency_level               = 8
-  query_acceleration_max_scale_factor = 0
+  query_acceleration_max_scale_factor = null
  auto_suspend                        = 60
  statement_queued_timeout_in_seconds = 3600
  statement_timeout_in_seconds        = 3600
  warehouse_type                      = "STANDARD"
}

```

この内容は以下の Issue に書かれています。

- {{< exlink href="https://github.com/snowflakedb/terraform-provider-snowflake/issues/1628" >}}

直近で Snowflake Terraform Provider のバージョンを一気にあげたのですがその際に変更が漏れていた部分でした。
これらがバージョンアップ時に plan や Apply で特に差分がなかったのですが、今回あたらしく warehouse のリソースを作成したタイミングでエラーが発生しました。

## まとめ

今回は Snowflake の Terraform Provider のエラーについてまとめました。
Terraform では Apply 時に初めてエラーにな流ことがたまにあるのが難しいところです。
このようなエラーが発生した場合は、Terraform Provider のリリースノートや Issue を確認するのが良さそうです。

