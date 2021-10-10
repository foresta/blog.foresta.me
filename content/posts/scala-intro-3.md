+++
title="Scala入門 その3 クラスとオブジェクト"
date="2021-10-10T10:00:39+09:00"
categories = ["engineering"]
tags = ["Scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala 入門のメモとして今回は、クラスとオブエクトについてまとめます。

## クラス

以下のようなよくある構文でクラスを定義できます。

```scala
class ClassName(field1: Int, field2: Int) {

  // 補助コンストラクタ
  def this(field1: Int) = this(field1, 0)
  
  // メソッド
  def method1(arg: Int): Int = {
    arg + field1
  }
}
```

クラス名を宣言するとプライマリコンストラクタになり、引数もかける感じです。
セカンダリコンストラクタを定義するには、`this` キーワードを使います。セカンダリコンストラクタないでプライマリコンストラクタを呼ぶために、`this(field1, 0)` のように呼び出す必要があります。

インスタンスを生成する側は以下のような感じです。

```scala
val class1 = new ClassName(1, 10)
println(class1.method1(10)) // => 11

val class2 = new ClassName(1)
```

### アクセス修飾子

メソッドやフィールドには、Java などと同じようにアクセス修飾子がつけられます。

種類は、`private` (そのクラス内のみ) と `protected` クラスのサブクラスのみの公開

限定子を使って、さらに細かくアクセス範囲を限定できるようです。

```
private[X] val hoge
```
のように書くと、その範囲までアクセスができるようになります。

X には パッケージ名、クラス名、シングルトンオブジェクト名、もしくは `this` が入ります。

下記のように、Fuga クラスの field1 を以下のように定義すると、外側のクラスの Hoge でも field1 が参照できるようになります。

```scala
object Main extends App {
  val hoge = new Hoge(1, 10)
  hoge.method1()
}

class Hoge(field1: Int, field2: Int) {
  
  // メソッド
  def method1(): Unit = {
    val fuga = new Fuga
    println(s"Fuga field1 = ${fuga.field1}")
  }

  class Fuga {
    private[Hoge] val field1 = 10 // Hoge クラス内でも参照できるようにする
  }
}
```

クラスの継承は、`extends` キーワードを使用します。

```scala
object Main extends App {
  val hoge: Fuga = new Hoge
  hoge.method1() // Hoge.method1
}


class Fuga {
  def method1(): Unit = {
    println("Fuga.method1")
  }
}

class Hoge extends Fuga {
  override def method1(): Unit = {
    println(s"Hoge.method1")
  }
}

```

## オブジェクト

Scala では、static を用いることができないため代わりに `object` キーワードを使用します。

オブジェクトは、以下のように記述することができます。

```scala
object Main extends App {
  Hoge.method1()
}

object Hoge {
  def method1(): Unit = {
    println(s"Hoge.method1")
  }
}
```

いわゆるクラスメソッドのように、`Hoge.method1()` と呼ぶことができますが、実際はシングルトンオブジェクトのようなものになります。

構文としては以下の通りです。

```
object {オブジェクト名} extends {クラス名} (with {トレイト名}) {
}
```

オブジェクトは、同名のクラスのファクトリメソッドしても使用することができます。

```scala
object Main extends App {
  val hoge = Hoge(1, 2)
  println(hoge.sum())
}

class Hoge(field1: Int, field2: Int) {
  def sum(): Int = field1 + field2
}

object Hoge {
  def apply(f1: Int, f2: Int): Hoge = new Hoge(f1, f2)
}
```

apply メソッドは特別なもので、上記の `Hoge(1, 2)` が `Hoge.apply(1, 2)` として処理系では扱われることになります。

これはコンパニオンオブジェクトと呼ばれます。

上記の class 定義 + object と apply メソッドは、`case class` を用いて簡単に記述できます。（こちらがメインで使われるかと思います。）


```scala
case class Hoge(field1: Int, field2: Int)
```

## まとめ

今回は、Scala のクラスとオブジェクトについてまとめました。
この記事では書きませんでしたがトレイトなども強力なためクラスとオブジェクトの基本は一度触れておくと良さそうだと思います。
