+++
title="Scala で List から Mapに変換する"
date="2022-06-05T22:39:46+09:00"
categories = ["engineering"]
tags = ["scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala で List から Map に変換する方法についてまとめます。

## toMap で Map にする

list から Map にするためには、まず List を Tuple のリストに変換してから `toMap` メソッドを呼ぶことで変換することができます。

```scala
val list = Seq(1,2,3,4,5)
list.map(i => (i, i.toString)).toMap // Map<Int, String>
```

## 実装の中身をみる

toMap の定義を見ると以下のようになっています。

```scala
def toMap[K, V](implicit ev: A <:< (K, V)): immutable.Map[K, V] =
  immutable.Map.from(this.asInstanceOf[IterableOnce[(K, V)]])
```

`Map.from` の定義を見ると以下のようになってました。

```scala
def from[K, V](it: collection.IterableOnce[(K, V)]): Map[K, V] =
  it match {
    case it: Iterable[_] if it.isEmpty => empty[K, V]
    case m: Map[K, V] => m
    case _: (newBuilder[K, V] ++= it).result()
  }
```

`Map.from` では IterableOnce 型を受け取って、Mapに追加してます。

`toMap` は IterableOnce 型に生えているメソッドで以下の implicit の条件を満たさないと呼ぶことができません。

```scala
(implicit ev: A <:< (K, V))
```

気になるのが、`<:<` です。

定義を見ると以下のようになっています。

```scala
/**
  * An instance of `A <:< B` witnesses that `A` is a subtype of `B`.
  * 省略...
  */
 // They are here simply for reference as the "correct", safe implementations.
 @implicitNotFound(msg = "Cannot prove that ${From} <:< ${To}.")
 sealed abstract class <:<[-From, +To] extends (From => To) with Serializable {
 }
```

A が B のサブタイプであることを示す型のようです。

おおもとの implicit の型を見ると
```
A <:< (K, V)
```
となっているので、IterableOnce の型 A が、Tuple (K, V) のサブタイプであることを指定してます。

つまり、toMap を呼ぶためには、(K, V) のサブタイプ型の IterableOnce である必要がありそうです。

ちなみに、

`@implictNotFound` アノテーションで implicit が定義されていないときのメッセージが指定されているようでした。

実際に以下のようなコードを書くと

```scala
val list = Seq(1,2,3,4,5)
list.toMap
```

以下のようなエラーメッセージが表示されました。

```scala
Cannot prove that Int <:< (K, V)

where:    K is a type variable
          V is a type variable
.
```

## まとめ

今回は、List から Map に変換する方法についてまとめました。
実装の中身を見ると、implicit などを用いてうまく書かれてるなと参考になることが多いです。IntelliJ などIDE を使っていれば簡単にソースも見れて、面白いのでおすすめです。

