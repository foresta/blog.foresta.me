+++
title="Scala から Parameter Store のデータにアクセスする"
date="2022-11-13T19:26:30+09:00"
categories = ["engineering"]
tags = ["scala", "aws", "ssm", "parameter-store"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala から AWS の パラメータストアのデータを読むために実装したのでメモです。

## 前提

Scala から AWS のリソースにアクセスするために aws-sdk を使用します。build.sbt に以下のように依存を追加します。

```
libraryDependencies ++= Seq(
    "software.amazon.awssdk" % "ssm" % "2.17.196"
)
```

また、Scala を ECS などで動かす場合には、SSM Parameter Store にアクセスできる IAM Policy を付与する必要があるので事前に追加しておきます。

以下のような Policy が必要となります。

```json
{
    "Effect": "Allow",
    "Action": [
        "ssm:GetParameter"
    ],
    "Resource": [
        "arn:aws:ssm:{REGION}:{ACCOUNT_ID}:parameter:/example/parameter"
    ]
}
```

## 実装

awssdk に、SSMClient があるのでそちらを使います。

SsmClient には同期的なバージョンと、非同期用のバージョンの２つがあります。

- SsmClient
- SsmAsyncClient

Scala で Future を使って非同期処理をするのであれば、後者の SsmAsyncClient を使用します。

両方の Client には、builder が用意されているので、それを利用します。

```scala
SsmAsyncClient.builder().region(Region.of("ap-northeast-1"))
```

実際にリクエストを送る際には、`GetParameterRequest` を作り、ssmClient に渡します。
パラメータのタイプが、`SecureString` の場合には、`withDecryption` で `true` を設定する必要があります。

```scala
// SecureString の場合は、withDecryption が必要
val request = GetParameterRequest
    .builder()
    .withDecryption(true)
    .name(paramName)
    .build()
```

この リクエストを先程の、`ssmClient` に渡します。

```scala
ssmClient
    .getParameter(request)
    .toScala
    .map(res => Right(res.parameter().value()))
    .recover { err =>
        log.error(s"Fetch SSM parameter store failed. name=${paramName}", err)
        Left(err)
    }
```

`getParameter` の返戻値は、Java の `CompletableFuture` なので、toScala メソッドで Scala の Future に変換します。

toScala メソッドを使うためには以下の import が必要です。

```scala
import scala.compat.java8.FutureConverters.CompletionStageOps
```

最後に、結果を `Either` で返すために、`map` や `recover` を利用しています。


ここまでの内容で以下のような、SSM Parameter Store に接続して、値を `Either` 型で返すクラスは以下のように定義できます。


```scala
import software.amazon.awssdk.services.ssm.SsmAsyncClient
import software.amazon.awssdk.services.ssm.model.GetParameterRequest

import scala.compat.java8.FutureConverters.CompletionStageOps
import scala.concurrent.{ExecutionContext, Future}

class SSMParameterRepository() {
   
    lazy val ssmClient: SsmAsyncClient = {
       SsmAsyncClient.builder().region(Region.of("ap-northeast-1"))
    }

    def getParam(paramName: String)(implicit executionContext: ExecutionContext): Future[Either[Throwable, String]] = {
        // SecureString の場合は、withDecryption が必要
        val request = GetParameterRequest
            .builder()
            .withDecryption(true)
            .name(paramName)
            .build()

        ssmClient
            .getParameter(request)
            .toScala
            .map(res => Right(res.parameter().value()))
            .recover { err =>
                log.error(s"Fetch SSM parameter store failed. name=${paramName}", err)
                Left(err)
            }
    }
}
```

## まとめ

今回は、awssdk を使って、Scala から AWS の SSM Parameter Store にアクセスする方法についてまとめました。
awssdk は Java の SDK を利用していますが、記事の通り Scala の世界でも使用することができ Scala の Future に変換する方法なども用意されてます。
Scala などの JVM 言語でコードを書いていると Java の世界とを行き来するようなコードを書くこともあるので、このあたりを覚えておくとかけるコードの範囲が広がり既存の Java の資産を活かせそうだなと思います。
