+++
title="AWS CLI を使う時はPROFILE を環境変数に入れておくと便利"
date="2024-07-28T19:02:24+09:00"
categories = ["engineering"]
tags = ["aws-cli", "cli"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

タイトルの通り、AWS CLI を使う時に環境変数で使用する PROFILE を指定しておくと便利だったのでメモしておきます。


## AWS_PROFILE を使う

通常 AWS CLI をつかうときは以下のように `--profile` オプションを使ってプロファイルを指定します。

```bash
$ aws s3 ls --profile my-profile
```

しかし、aws cli を連続で打つ場合などに毎回 `--profile` オプションを指定するのは面倒です。そこで、環境変数 `AWS_PROFILE` にプロファイル名を指定しておくと、`--profile` オプションを省略してコマンドを実行できます。

```bash
$ export AWS_PROFILE=my-profile
$ aws s3 ls
```

aws cli を使って、AWS の大量のリソースをセットアップしたいという時は使うと良さそうです。

## その他の環境変数

その他に、AWS CLI でサポートされている環境変数としては以下のようなものがあります。

- AWS_ACCESS_KEY_ID
- AWS_CA_BUNDLE
- AWS_CLI_AUTO_PROMPT
- AWS_CLI_FILE_ENCODING
- AWS_CLI_S3_MV_VALIDATE_SAME_S3_PATHS
- AWS_CONFIG_FILE
- AWS_DATA_PATH
- AWS_DEFAULT_OUTPUT
- AWS_DEFAULT_REGION
- AWS_EC2_METADATA_DISABLED
- AWS_ENDPOINT_URL
- AWS_ENDPOINT_URL_<SERVICE>
- AWS_IGNORE_CONFIGURED_ENDPOINT_URLS
- AWS_MAX_ATTEMPTS
- AWS_METADATA_SERVICE_NUM_ATTEMPTS
- AWS_METADATA_SERVICE_TIMEOUT
- AWS_PAGER
- AWS_PROFILE
- AWS_REGION
- AWS_RETRY_MODE
- AWS_ROLE_ARN
- AWS_ROLE_SESSION_NAME
- AWS_SDK_UA_APP_ID
- AWS_SECRET_ACCESS_KEY
- AWS_SESSION_TOKEN
- AWS_SHARED_CREDENTIALS_FILE
- AWS_USE_DUALSTACK_ENDPOINT
- AWS_USE_FIPS_ENDPOINT
- AWS_WEB_IDENTITY_TOKEN_FILE

それぞれの詳細はいかのサイトを参照してみてください。

- {{< exlink href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html" text="Environment variables to configure the AWS CLI" >}}

## まとめ

今回は AWS CLI を使う際に便利な環境変数について紹介しました。環境変数を使って、AWS CLI をより便利に使うことができそうです。
