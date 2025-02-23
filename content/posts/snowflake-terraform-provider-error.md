+++
title="Terraform 管理の Snowflake で、Plan, Apply がエラーになった話"
date="2025-02-23T20:43:52+09:00"
categories = ["enginering"]
tags = ["snowflake", "data-engineering"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段 Snowflake を Terraform で管理していますが、2025 年 2 月の中旬ころから Terraform の Plan や Apply にエラーが発生して反映ができなくなる事象がおきたので調査のメモです。

## 発生した事象

Terraform を適用しようと、GitHub Actions の CI 上から Terraform Plan を実行していたのですが、その際にエラーが発生していました。

内容としては、以下のように、snowflake_managed_account に関するところでエラーになっていました。
```
Error: giving up after 5 attempts
   with module.test_shates.snowflake_managed_account.test
   on ../../modules/ex_test/main.tf line 13, in resource "snowflake_managed_account" "test":
   13: resource "snowflake_managed_account" "test" {
```

## 原因

Snowflake の `2024_08 Bundle` が 2 月にデフォルト enabled で適用されました。

- {{< exlink href="https://docs.snowflake.com/en/release-notes/bcr-bundles/2024_08_bundle" >}}

上記の公式サイトにも以下のように記載されています。

> Status changed in the 9.2 release (January 22-February 13, 2025) to Enabled by Default; account admins can disable for opt-out.

その中で Deprecated になっているカラムが削除されるようで、その関係で Snwoflake Terraform Provider 側でエラーになっていました。

すでに Issue も上がっていて修正の PR も上がっている状況です。


- Issue
    - {{< exlink href="https://github.com/Snowflake-Labs/terraform-provider-snowflake/issues/3394" >}}

- 修正 Pull Request
    - {{< exlink href="https://github.com/Snowflake-Labs/terraform-provider-snowflake/pull/3395">}}


ただし、こちらのバージョン (v1.0.4) はまだリリースされておらず、反映はできない状態です。


## エラーの回避方法

Snowflake の `2024_08 Bundler` を無効化すれば、Terraform で Plan や Apply を実行することができます。

無効化するには、ACCOUNT_ADMIN 権限を持つユーザーが Snowflake に対して以下の SQL を実行します。


```SQL
-- Bundle の助教を確認
SELECT SYSTEM$SHOW_ACTIVE_BEHAVIOR_CHANGE_BUNDLES();

-- 2024_08 Bundle のステータスを確認
SELECT SYSTEM$BEHAVIOR_CHANGE_BUNDLE_STATUS('2024_08') 


-- 2024_08 Bundle を無効化する
SELECT SYSTEM$DISABLE_BEHAVIOR_CHANGE_BUNDLE('2024_08')
```

この状態で、Terraform Apply など実行すれば成功するようになっていると思います。

## 根本解決

基本的には、`terraform-provider-snowflake` 側の修正を待って、バージョン `v1.0.4` に アップデートするしか無いです。

ただし、2025 年 3 月 にこのバンドルのステータスが ` Generally Enabled` になる予定なのでそれまでに対応されないとエラーが出ることになりそうです。

> Status planned to change in March 2025 to Generally Enabled; however, this schedule is subject to change.


## まとめ

今回は、Snowflake の Terraform 実行時にエラーが発生する現象とその回避法についてまとめました。
公式のリリースまちなので、リリースされたら早めにバージョンアップするのが良さそうです。
