+++
title="Scala で Retry 処理を実装する"
date="2022-11-27T22:07:26+09:00"
categories = ["engineering"]
tags = ["scala", "retry"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala で retry 処理を実装する必要があったのですがライブラリを使って簡単に実装できたのでメモです。

## retry 処理を実現するライブラリ

Scala で retry をするためのライブラリをいくつかありますが、今回は以下を使用しました。

- {{< exlink href="https://github.com/softwaremill/retry" >}}

使い方は簡単で、retry するポリシーを定義し、成功とする条件を定義し、apply をします。

retry する対象のメソッドは以下とします。

```scala
def now(): LocalDateTime = LocalDateTime.now(ZoneOffset.UTC)

var start = now()
var execCount = 0
def exec(num: Int): Future[Int] = {
    Future {

        //////// ロギング用
        execCount += 1
        val elapsed = ChronoUnit.MILLS.between(start, now()) / 1000
        println(s"### exec ${execCount} times. ${elapsed}s")
        //////// ロギング用
        
        num % 2
    }
}
```

与えられた数を2で割った余りを返すメソッドです。

色々とログを出すために、リトライをした回数と開始時からの経過秒数を計算してます。


実際に上記のメソッドを retry しながら呼んでみます。

まずは単純に retry する方法から。

```scala
// Futureを返すメソッドの成功の条件
// 2 で割ったあまりが 0 ならば成功とする
implicit val success: retry.Success[Int] = retry.Success(res => res == 0)

// 5 回再実行する
val policy = retry.Directly(5).apply { () =>
    // 2で割ったあまりは 0 じゃないので必ず失敗する
    exec(1)
}

Await.result(policy, Duration.Inf)
```

上記を実行すると以下のような結果になります。

```
### exec 1 times. 0s
### exec 2 times. 0s
### exec 3 times. 0s
### exec 4 times. 0s
### exec 5 times. 0s
### exec 6 times. 0s
```

最初の実行に加えて 5 回 retry され合計で 6 回メソッドが呼ばれていることがわかります。

今回は、`Directly` という retry policy を使用しましたが他にいくつか policy があるのでそちらも試してみます。

### Pause

Pause は第二引数で指定した時間だけまってからリトライをします。

```scala
implicit val success: retry.Success[Int] = retry.Success(res => res == 0)

val policy = retry.Pause(5, 2.seconds).apply { () =>
    exec(1)
}

Await.result(policy, Duration.Inf)
```

以下のように 2秒おきに retry されていることがわかります。
```
### exec 1 times. 0s
### exec 2 times. 2s
### exec 3 times. 4s
### exec 4 times. 6s
### exec 5 times. 8s
### exec 6 times. 10s
```

### Backoff

Backoff は第二引数で指定した時間を初期値として、2のべき乗ずつ実行を遅らせながらリトライをします。

```scala
implicit val success: retry.Success[Int] = retry.Success(res => res == 0)

val policy = retry.Backoff(5, 2.seconds).apply { () =>
    exec(1)
}

Await.result(policy, Duration.Inf)
```

以下のように 2秒 => 4秒 => 8秒 => 16秒 ... とretry 間隔を伸ばしながら実行されていることがわかります。
```
### exec 1 times. 0s
### exec 2 times. 2s
### exec 3 times. 6s
### exec 4 times. 14s
### exec 5 times. 30s
### exec 6 times. 62
```

実際のシステムで使う際は Backoff を使うと良さそうに思います。

## まとめ

今回は、{{< exlink text="softwaremill/retry" href="https://github.com/softwaremill/retry">}} を用いて Scala で retry をする方法についてメモをしました。

外部APIの呼び出しや、DB 接続などシステムが外部に依存する箇所では、適切に retry やエラーハンドリングを行う必要がありますが、Scala のコード上で retry は簡単に実現できて良さそうです。
