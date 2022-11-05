+++
title="Scala で case class をソートする"
date="2022-11-05T12:35:48+09:00"
categories = ["engineering"]
tags = ["scala", "case-class"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala で case class は非常に便利でよく使いますが，case class でソートしたい場合などに工夫が必要なのでまとめます．

## ソートする方法

以下のような `UserId` データを考えます．

```scala
case class UserId(value: Int)
val ids = Seq(UserId(1), UserId(5), UserId(10), UserId(2), UserId(4))
```

```scala
ids.sorted
```

上記のようにソートされた値を取得しようとすると以下のようなエラーが表示されます．

```
No implicit Ordering defined for B

where:    B is a type variable with constraint >: UserId
..
I found:

    scala.math.Ordering.ordered[B](
      /* missing */summon[scala.math.Ordering.AsComparable[B]]
    )

But no implicit values were found that match type scala.math.Ordering.AsComparable[B]
```

UserId クラスが Ordering トレイトが実装していないため，比較ができずにソートすることができないです．

case class の配列である ids をソートしたいといったユースケースを実現するためにいくつか方法があるのでまとめます．

### value の値でソートする

１つめは 内部の value にアクセスして以下のようにします．

```scala
ids.sortBy(_.value) // List(UserId(1), UserId(2), UserId(4), UserId(5), UserId(10))
```

ただし，この方法や UserId としてせっかくカプセル化しているのに，value の情報が外部に公開されてしまいますし，下記のように value を private にすると当然つかえません．

```scala
case class UserId(private value: Int)

ids.sortBy(_.value) // value にアクセスできないので Error
```

### Ordering を実装した implicit object を使う

case class に Ordering トレイトが実装されていないことが問題だったので，implicit object を定義して実装します．

```scala
case class UserId(private value: Int)
object UserId {
  implicit object UserIdOrdering extends Ordering[UserId] {
    override def compare(x: UserId, y: UserId): Int = x.value.compareTo(y.value)
  }
}
```

上記のような定義にするとソートすることが出来ます．

```scala
ids.sorted // List(UserId(1), UserId(2), UserId(4), UserId(5), UserId(10))
```

### Ordered トレイトを実装する

もう一つ方法としては，Ordered トレイトを直接 UserId case class に実装する方法があります．

```scala
case class UserId(private val value: Int) extends Ordered[UserId] {
    override def compare(that: UserId): Int = value.compareTo(that.value)
}
```

この方法でもソートすることが出来ます．
Ordering トレイトを実装する方法と比較して，compare メソッドのシグニチャが変わっているので注意が必要です．

#### Ordering

```scala
override def compare(x: UserId, y: UserId): Int
```

#### Ordered

```scala
override def compare(that: UserId): Int
```

## まとめ

今回は，case class をソート可能にするための実装についてまとめました．

case class を使うと型の表現力があがるので積極的に使っていきたいですが，こういったどのトレイト周りを実装すべきかという点については考慮する必要がありそうです．
