+++
title="Scala入門 その5 関数とクロージャ"
date="2021-10-24T12:00:00+09:00"
categories = ["engineering"]
tags = ["scala", "function", "fp"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Scala 入門 その5 ということで関数とクロージャについてまとめます。

## メソッドと関数

Scala では、メソッドと関数が明確な違いがあります。

関数はそれ自体が値となりますが、メソッドはScalaの言語の機能でそのままでは値として扱えないようです。

それぞれみていきます。

### メソッド

クラス、トレイト、シングルトンオブジェクトのメンバーになっている関数をメソッドと呼びます。

```scala
object Hoge {
  def hello(): Unit = {
    println("Hello")
  }
}
```

println などもメソッドですが、Scala の Predef オブジェクトの中に定義されています。

```scala
package scala
object Predef extends scala.LowPriorityImplicits {
    // ...
    def println() : scala.Unit = { /* ... */ }
    // ...
}
```

### 関数値と関数リテラル

一方関数は、以下のような関数リテラルで定義することができます。

```scala
object Main {
  def main(args: Array[String]): Unit = {

    val add = (x: Int, y: Int) => x + y
    println(add(1,2))   // => 3
    println(add)        // => Main$$$Lambda$15/0x0000000800081200@37d31475
  }
}
```

関数の実態は、FunctionN トレイトを実装したオブジェクトらしいです。
以下の書き方と同じになります。

```scala
object Main {
  def main(args: Array[String]): Unit = {

    val addF = new Function2[Int, Int, Int] {
      override def apply(v1: Int, v2: Int): Int = v1 + v2
    }
    println(addF(1,2))  // 3
    println(addF)       // <function2>
  }
}
```

型が、`Main$$$Lambda` と `<function2>` で違うのですがこれはどういった違いがあるかはわかってません。


## クロージャ

変数をキャプチャした関数リテラルのことをクロージャと呼びます。

以下のように、num という変数をキャプチャした add 関数はクロージャです。

```scala
object Main extends App {

  var num = 1

  // 変数 num をキャプチャした関数
  val add = (x: Int) => x + num

  println(add(10)) // 10 + 1 で 11

  num = 3
  println(add(10)) // => キャプチャするのはあくまで参照なので、13 になる
}
```

また、上記の例のように、キャプチャするのは変数への参照のようでキャプチャした変数を書き換えると関数の結果自体も変化します。

上記のような `(x: Int) => x + num` のような関数リテラルに置いて、x を束縛された変数といい、num を自由変数と呼びます。
そして、自由変数を持つ `(x: Int) => x + num` のような関数リテラルを開項 と呼び、`(x: Int) => x + 1` のように自由変数のない関数リテラルを閉項と呼ぶそうです。
自由変数を持つ開項を変数をキャプチャ (参照情報を保持) することによって閉じることからクロージャー (Closure) と呼ばれます。

## 部分適用とカリー化

### 部分適用

関数に部分的に、引数を適用した関数を作ることもできます。

```scala
object Main extends App {
  def add(x: Int, y: Int) = x + y

  // 10 を適用した add10 関数
  val add10 = add(10, _: Int)
  println(add10(5)) // => 15
}
```

上記の例では、add 関数の 第一引数に 10 を適用した add10 関数を生成しています。
`add10(5)` は適用した 10 を用いて、`10 + 5 = 15` が計算されます。

引数を一つも適用しないこともできて、以下のようにすると、add 関数と同じ a という関数を生成できます。


```scala
object Main extends App {
  def add(x: Int, y: Int) = x + y
  
  val a = add _
  println(a(5, 10)) // => 15
}
```

### カリー化

また、関数の引数のリストを複数定義することでカリー化もできる。

```scala

object Main extends App {

  def add(x: Int)(y: Int) = x + y

  val add5 = add(5)
  println(add5(10))   // => 15

  // 複数のカッコを繋げてもかける
  println(add(5)(10)) // => 15
}
```

カリー化を使えば以下のような File を読み込んで処理を行った後に必ず close するようなメソッドを作ることができます。

```scala
import scala.io.Source

object Main extends App {

  withSource("./src/Main.scala") { src =>
    src.getLines().foreach(println)
  }

  def withSource(filepath: String)(op: Source => Unit) = {
    val source = Source.fromFile(filepath)
    try {
      op(source)
    } finally {
      source.close()
    }
  }
}
```

## 特殊な関数の引数

関数の引数で特殊なパターンがいくつかあるので説明します。

### 連続パラメータ

引数を次のように指定すると `def (args: Type*) = { ... }` 可変長の引数を渡すことができます。

```scala
object Main extends App {
  def sum(args: Int*) = args.fold(0) { (acc, x) => acc + x }

  println(sum(1,2,3,4)) // => 10
  println(sum(10,20))   // => 30

  val seq = Seq(1,2,3,4,5,6,7,8,9,10)
  println(sum(seq: _*)) // 55
}
```

可変長引数を受け取る関数に対して リストを渡したい場合は、上記の最後のように、`sum(seq: _*)` といった風に呼び出す必要があります。

### 名前付き引数

下記のように引数名を指定して関数を呼び出すことができます。

```scala
object Main extends App {
  def sub(x: Int, y: Int) = x - y

  println(sub(10, 5)) // 10 - 5 = 5
  println(sub(x = 10, y = 5)) // 10 - 5 = 5
  println(sub(y = 10, x = 5)) // 5 - 10 = -5
}
```

### デフォルト値

引数のデフォルト値も定義することができます。

```scala
object Main extends App {
  def sub(x: Int, y: Int = 1) = x - y

  println(sub(10, 5)) // 10 - 5 = 5
  println(sub(10)) // 10 - 1 = 9
}
```

### 引数が1つの時

引数が一つのみの関数の場合は、中括弧を使って下記のように書けます。（カリー化の節の `withSource` でもこれを使いました）

```scala
object Main extends App {
  def inc(x: Int) = x + 1

  val num = inc { 10 }
  println(num)
}
```

### 名前渡しパラメータ

名前渡しパラメータは、関数の引数に式をそのまま渡すことができるものです。

実際のコードを見てみます。

`print_1`, `print_2`, `print_3` という三つのメソッドを定義しました。 

```scala
object Main extends App {
  def print_1(s: String) = {
    println("before print")
    println(s)
    println("after print")
  }

  def print_2(s: () => String) = {
    println("before print")
    println(s())
    println("after print")
  }

  def print_3(s: => String) = {
    println("before print")
    println(s)
    println("after print")
  }


  def getName(): String = {
    println("exec getName()")
    "Taro"
  }

  println("======== print_1 ========")
  print_1(getName())
  println("======== print_2 ========")
  print_2(() => getName())
  println("======== print_3 ========")
  print_3(getName())
}
```

上記を実行すると以下のような結果になります。

```
======== print_1 ========
exec getName()
before print
Taro
after print
======== print_2 ========
before print
exec getName()
Taro
after print
======== print_3 ========
before print
exec getName()
Taro
after print
```

print_1 は、getName が先に評価されて、print が実行されています。

print_2 は、関数を渡しているので print 内部でgetName が実行されています。

注目すべきは print_3 で、`print_3(getName())` と実行しているのにもかかわらず、getName の評価は、print メソッドの中になります。
これが名前渡しパラメータで、`def print_3(s: => String) = {}` と定義すると、getName() がそのまま評価される前の式として渡され、print_3 メソッドの中で評価されたタイミングで実行されるようになります。

`print_2(() => getName())` の呼び出し方の省略記法とも言えるかもしれません。

## まとめ

今回は、関数とクロージャについてまとめました。

関数型言語でもある Scala だけあって、カリー化など色々な機能が備わっていて表現力も高いなぁと感じました。
これらをうまく活用して効率の良いコードを書いていけると良さそうです。
