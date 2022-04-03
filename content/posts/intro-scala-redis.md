+++
title="scala-redis を使ってみる"
date="2022-04-03T18:01:30+09:00"
categories = ["engineering"]
tags = ["scala", "redis"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、scala-redis を使用する際に調査したことをまとめます。

## scala-redis

scala-redis は scala 用の redis クライアントになります。

- {{< exlink href="https://github.com/debasishg/scala-redis" >}}

使用方法は以下のような感じです。

```scala
import com.redis.RedisClient

val client = new RedisClient(host, port)
client.set("test-1", "1")
client.set("test-2", "2")

client.get("test-1") shouldBe Some("1")
client.get("test-2") shouldBe Some("2")
client.get("test-3") shouldBe None
```

ttl を入れるときは以下のように設定できます。

```scala
client.set("test-1", "1", expire = 1.second)
client.get("test-1") shouldBe Some("1")

sleep(1000)

client.get("test-1") shouldBe None
```

redis の NX, XX なども設定できます。

```scala
// NX: 値がすでにあれば書き込まない
client.set("test-1", "1", whenSet = NX) shouldBe true
client.set("test-1", "1", whenSet = NX) shouldBe false
```

set 意外にも bulk で書き込む `mset` もあります。

```scala
val list = Seq(("test-1", "1"), ("test-2", "2"))
client.mset(list:_*)

client.get("test-1") shouldBe Some("1")
client.get("test-2") shouldBe Some("2")
```

ユーザー定義のオブジェクトも設定することができます。

set と get の定義は、以下のようになっています。

```scala
override def set(
    key: Any, value: Any, whenSet: SetBehaviour = Always, expire: Duration = null
)(implicit format: Format): Boolean = {
    // ...
}

override def get[A](key: Any)(implicit format: Format, parse: Parse[A]): Option[A] = {
    // ...
}
```

format と parse を独自に定義すれば、ユーザー定義のオブジェクトも設定できます。

format は、

```
Format(format: PartialFunction[Any, Any])
```
を定義します。
`Item` のような case class の場合は、Item -> String などに変換する処理を定義すればOKです。

parse は、
```
Parse[A](f: (Array[Byte]) => T)
```
を定義します。
Redis から取得した Byte型の Array を T (`Item` など) に変換する関数を渡して定義すればOKです。

ただこちら、Format の方が Generics が使われてなくて若干扱いづらいので、Format, Parse を使わずに JSON 文字列などに Serialize / Deserialize をしてから入れると良さそうに思います。



Connection Pooling を使用するためには以下のように client を作成します。

```scala

val pool = new RedisClientPool(host, port)

pool.withClient {
    client => {
        client.set("test-1", "1")
    }
}
```

## まとめ

今回は、scala-redis で行う基本的な操作をしらべました。

ドキュメントとソースを見れば基本的な操作は簡単にできて良さそうです。
