+++
title="QuickSight のテンプレート機能つかってみる"
date="2024-12-08T22:05:41+09:00"
categories = ["engineering"]
tags = ["aws", "quicksight"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は QuickSight でテンプレートを作成する方法について記載します。

## QuickSight のテンプレート機能

QuickSight にはテンプレート機能が用意されています。
テンプレート機能を使うと、分析やダッシュボードをコピーすることができます。
これは例えば、ダッシュボードを開発環境と本番環境などに分けてデプロイする際などに活用することができます。

テンプレート昨日は、AWS コンソールの GUI からは作成することができず CLI 操作となります。

## テンプレートの作成

まずは、テンプレートを作成するための JSON ファイルを作成します。

以下のようなファイルを作成します。
```
{
  "SourceAnalysis": {
    "Arn": "arn:aws:quicksight:${REGION}:${AWS_ACCOUNT_ID}:analysis/${TARGET_ANALYSIS_ID}",
    "DataSetReferences": [
      {
        "DataSetPlaceholder": "DATA_SET_1",
        "DataSetArn": "arn:aws:quicksight:${REGION}:${AWS_ACCOUNT_ID}:dataset/${DATA_SET_1_ID}"
      },
      {
        "DataSetPlaceholder": "DATA_SET_2",
        "DataSetArn": "arn:aws:quicksight:${REGION}:${AWS_ACCOUNT_ID}:dataset/${DATA_SET_2_ID}"
      }
    ]
  }
}
```

中を説明すると、対象の分析とその分析でしようしているデータセットを指定します。

これらのデータは、`DataSetReferences` は自動生成できるのそのスクリプトも記載します。


```bash
$ aws quicksight describe-analysis-definition --aws-account-id ${AWS_ACCOUNT_ID} --analysis-id ${TARGET_ANALYSIS_ID} \
| jq .Definition.DataSetIdentifierDeclarations \
| jq '. | map({ "DataSetPlaceholder": .Identifier, "DataSetArn": .DataSetArn })'`
```

こちらは、aws-cli で `describe-analysis-definition` を実行すると取得でいる JSON から `jq` を用いて必要な情報を取得しています。

この JSON を用いてテンプレートを作成します。

テンプレートの作成は、`create-template` コマンドを利用します。

先ほどのJSON を `template-definition.json` として保存しておいた場合、以下のコマンドでテンプレートを作成できます。
```bash
aws quicksight create-template \
--aws-account-id ${AWS_ACCOUNT_ID} \
--template-id ${TEMPLATE_ID} \
--name ${TEMPLATE_NAME} \
--source-entity file://template-definition.json
```

テンプレートが作成できたら次にこのテンプレートを利用してダッシュボードを作成します。

ダッシュボード作成のためにも JSON ファイルを作成します。

```json
{
  "SourceTemplate": {
    "DataSetReferences": [
      {
        "DataSetPlaceholder": "DATA_SET_1",
        "DataSetArn": "arn:aws:quicksight:${REGION}:${AWS_ACCOUNT_ID}:dataset/${OTHER_DATA_SET_1}"
      },
      {
        "DataSetPlaceholder": "DATA_SET_2",
        "DataSetArn": "arn:aws:quicksight:${REGION}:${AWS_ACCOUNT_ID}:dataset/${OTHER_DATA_SET_2}"
      }
    ],
    "Arn": "arn:aws:quicksight:${REGION}:${AWS_ACCOUNT_ID}:template/${TEMPLATE_ID}"
  }
}
```

ここでは、`DataSetReferences` と テンプレートの ARN を指定します。

DataSetReferences ですが、DataSetPlaceholder と DataSetArn を指定します。
DataSetPlaceholder はテンプレートで指定したデータセットの名前を指定します。DataSetArn は新しく作成するダッシュボードで利用するデータセットの ARN を指定します。
ここで、注目なのが元の分析とは別のデータセットをしていできるところです。この機能を使用すると開発環境の分析では開発環境用のデータベースを参照し、コピー後の本番環境では本番のデータベースを参照するといったことができます。

この JSON を用いてダッシュボードを作成するには、以下のコマンドを実行します。

```bash
$ aws quicksight create-dashboard \
--aws-account-id ${AWS_ACCOUNT_ID} \
--dashboard-id ${DASHBOARD_ID} \
--name ${DASHBOARD_NAME} \
--source-entity file://dashboard-definition.json
--version-description "${RELEASE_MESSAGE}" \
```

## まとめ

今回は、QuickSight のテンプレート機能について紹介しました。
テンプレート機能を利用するとダッシュボードのデリバリーなど効率化することができるため便利です。実際にプロダクトでも活用しています。
