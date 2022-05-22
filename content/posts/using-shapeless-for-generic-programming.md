+++
title="Scala で shapeless を使ってみる"
date="2022-05-22T12:26:33+09:00"
categories = ["engineering"]
tags = ["scala", "shapeless"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Scala の Generic Programming のためのライブラリの shapeless を使ってみたまとめです。

## shapeless とは

Shapeless は Scala 用の Generic Programming のライブラリです。

- https://github.com/milessabin/shapeless


Generic Programming は具体的なデータ型に直接依存しないことで抽象的で汎用的にコードを書こうとするプログラミング手法です。

shapeless では以下のような case class は以下のようなデータ型で表すことができます。

```scala
case class Item(name: String, num: Int)
Item("商品1", 10)

// =>
val item: String :: Int :: HNil = "商品1" :: 10 :: HNil
```

## case class を HList に変換する

shapeless では、以下のような型を HList と呼んでいます。

```scala
val item: String :: Int :: HNil = "商品1" :: 10 :: HNil
```

case class から HList に変換するのは以下のようにします。

```scala
import shapeless.{Generic, HList, ::, HNil}

case class Item(name: String, num: Int)

val itemGen = Generic[Item] 

// Item => HList
val hlist = itemGen.to(Item("item_1", 10))
// hlist: itemGen.Repr = "item_1" :: 10 :: HNil

// HList = Item
val item = itemGen.from(hlist)
```

HList はもとの型が違っても、構成が同じであれば同じ型としてみなせるため、以下のように `Item` => `ItemDto` の変換などは簡単に行えます。

```scala
import shapeless.{Generic, HList, ::, HNil}

case class Item(name: String, num: Int)
case class ItemDto(name: String, num: Int)

val dto = ItemDto("item_1", 10)
// ItemDto => HList => Item
val item = Generic[Item].from(Generic[ItemDto].to(dto))
```

## HList を再帰的に処理する

HList は head と tail で要素にアクセスすることができ再帰的に処理を行うことができます。

```scala
import shapeless.{Generic, HList, ::, HNil}

case class Item(name: String, num: Int)

val item = Item("item_1", 10)

val hlist = Generic[Item].to(item)

val name: String = hlist.head
val tail: Int :: HNil = hlist.tail
val num: Int = hlist.tail.head
```

活用例として、たとえば PreparedStatement に case class のデータをセットする処理は以下のように書けます。

```scala
// Parameter を PreparedStatement に設定する trait
trait ParamSetter[A] {
  def set(a: A, statement: PreparedStatement, index: Int): Int
}

object ParamSetter {

  // SetParameter は, Slick で用意されている PreparedStatement に Param を設定する trait
  // 基本的な型は用意されている
  implicit def defaultSetter[A](implicit setParameter: SetParameter[A]): ParamSetter[A] = new ParamSetter {
    def set(a: A, statement: PreparedStatement, index: Int): Int = {
      val positionedParameter = new PositionedParameters(statement)
      positionedParameter.pos = index
      setParameter(a, positionedParameter)
      index + 1
    }
  }

  implicit val hNilSetter: ParamSetter[HNil] = new ParamSetter {
    def set(a: HNil, statement: PreparedStatement, index: Int): Int = index
  }

  // 再帰的に処理を実行する
  // HList の H :: T で、hSetter は defaultSetter で処理し、
  // tSetter が再帰的に、hListSetter を呼ぶ
  // HList の最後の HNil は hNilSetter で処理する
  implicit def hListSetter[H, T <: HList](implicit hSetter: ParamSetter[H], tSetter: ParamSetter[T]): ParamSetter[H :: T] = new ParamSetter {
    def set(a: H :: T, statement: PreparedStatement, index: Int): Int = {
      val next = hSetter.set(a.head, statement, index)
      tSetter.set(a.tail, statement, index)
    }
  }

  // case class を HList に変換して実行するための def 
  implicit def genericSetter[A, R <: HList](implicit gen: Generic.Aux[A, R], setter: ParamSetter[R]): ParamSetter[A] = new ParamSetter {
    def set(a: A, statement: PreparedStatement, index: Int) = {
      setter.set(gen.to(a), statement, index)
    }
  }
}
```

上記で再帰的に HList を処理する trait が書けたので以下のように利用できます。

```scala
def setParams[ROW](row: ROW, statement: PreparedStatement, index: Int)(implicit setter: ParamSetter[ROW]) = {
  setter.set(row, statement, index)
}
```

```scala
implicit setter: ParamStter[ROW]
```
の部分で自動で適した ParamSetter が導出されるイメージです。

## まとめ

shapeless を使って case class を HList に変換する方法と活用例を書きました。

このあたりの、処理を実装するのに当たって以下のページが非常に参考になりましたので shapeless 気になる方は見てみるとよさそうです。

- {{< exlink href="https://books.underscore.io/shapeless-guide/shapeless-guide.pdf" >}}
- {{< exlink href="https://zenn.dev/yyu/articles/34f8800e3709e9" >}}


