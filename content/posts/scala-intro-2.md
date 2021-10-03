+++
title="Scala 入門 その2 制御構文"
date="2021-10-03T17:34:56+09:00"
categories = ["engineering"]
tags = ["scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala の 入門のメモとして今回は、制御構文についてまとめます。

## 制御構文

Scala に組み込みで用意されている制御構文として以下のものの使い方をまとめます。

- if
- while
- for 
- try
- match

### if

Scala の `if` は、文ではなく式なので、値を返します。

```
# if と else
if ( <条件式> ) <then式> else <else式>

# else の省略
if ( <条件式> ) <then式>
```

実際には以下のような使い方をします。

```scala
object Main extends App {
  val a = 10

  if (a > 9) {
    println("Hoge")
  } else {
    println("Fuga")
  }
}
```

if が式で値を返せるため、上記のコードは以下のように書けます。

```scala
object Main extends App {
  val a = 10

  val text = if (a > 9) "Hoge" else "Fuga"
  println(text)
}
```

println のなかに、if 文 をかけるので以下のようにも書けます。

```scala
  println(if (a > 9) "Hoge" else "Fuga")
```

### while

while は Java などと同様以下のように、使用します。

```scala
object Main extends App {
  var count = 1;
  while (count < 2000) {
    println("count = " + count);
    count = 2 * count;
  }
}
```

結果は以下のような感じ

```
count = 1
count = 2
count = 4
count = 8
count = 16
count = 32
count = 64
count = 128
count = 256
count = 512
count = 1024
```

do - while も Scala 2 以前は、ありましたが Scala 3 では、サポートされなくなったようです。

https://dotty.epfl.ch/docs/reference/dropped-features/do-while.html

また、break や、continue といったループを抜けたりする機能はありません。
代わりに再帰関数などを用いて代わりに表現する必要があります。

ただ、return によって途中で抜けることはできるようです。

```scala
object Main extends App {

  var count = 1
  println("count = " + sum(count))

  def sum(c: Int): Int = {
    var count = c
    while (count < 10) {
      count += 1
      if (count > 5) return count
    }
    count
  }
}
```

上記のようなコードで、count が 5 より大きくなった時に関数から抜けることができ、下記のような結果を返せます。

```
> count = 6
```

### for

for 式は、ジェネレータ と本体からなります。

```scala
object Main extends App {
  for (x <- 1 to 10) {
    println("x = " + x)
  }
}
```

`x <- 1 to 10` の部分がジェネレータになります。

実行結果は以下のようになります。

```
x = 1
x = 2
x = 3
x = 4
x = 5
x = 6
x = 7
x = 8
x = 9
x = 10
```

本体ブロックの前に、yield を使用することでジェネレータからリストなどを生成することもできます。

```scala
object Main extends App {
  val list = for (x <- 1 to 10) yield {
    x * 10
  }
  println(list)
}
```

```
Vector(10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
```

ジェネレータ部分に、if を追加することでフィルタリングすることもできます。
下記では、1 ~ 10 までで偶数のもののみを 10 倍したリストを作ります。

```scala
object Main extends App {
  val list = for (x <- 1 to 10 if x % 2 == 0) yield {
    x * 10
  }
  println(list)
}
```
```
Vector(20, 40, 60, 80, 100)
```

フィルターは複数かけることもできます。

```scala
object Main extends App {
  val list = for (
    x <- 1 to 10
    if x % 2 == 0
    if x > 5
  ) yield {
    x * 10
  }
  println(list)
}
```
```
Vector(60, 80, 100)
```

### try

try 式は例外をキャッチするための構文です。

いかに例外を出すプログラム例を書きます。

```scala
object Main extends App {
  val input = 4
  println(s"${checkEven(input)} is even value")

  def checkEven(x: Int): Int = {
    if (x % 2 == 0) x else throw new IllegalArgumentException("x should be even")
  }
}
```

`input = 4` だと、`4 is even value` が表示され、`input = 5` だと、`IllegalArgumentException` が送出されます。

この例外をキャッチするには try - catch を使って以下のように書くことができます。
```scala
  val checked = try {
    println(s"${checkEven(input)} is even value")
  } catch {
    case ex: IllegalArgumentException => println(s"$input is not even value: " + ex)
  }
```

また、finally 節もあり、例外を発生してもしなくても最終的に実行したい処理を書くこともできます。file などの IO のクローズ処理などを書くことが多いかと思います。

### match

match 式は、switch 文のような分岐やパターンマッチに使用することができるものになります。

よくある FizzBuzz は、for 式と match 指揮を組み合わせて以下のように書けます。

```scala
object Main extends App {
  for (x <- 1 to 100) {
    x match {
      case x if x % 15 == 0 => println("FizzBuzz")
      case x if x % 5 == 0 => println("Buzz")
      case x if x % 3 == 0 => println("Fizz")
      case _ => println(x)
    }
  }
}
```

また、パターンマッチでは、以下のように値を取り出すことができます。


```scala
object Main extends App {
  val list = List(1, 2, 3, 4, 5)

  list match {
    case List(1, b, 3, c, 5) =>
      println("b = " + b)
      println("c = " + c)
    case _ =>
      println("nothing")
  }
}
```

上記の例では、1番目が 1, 3番目が 3, 5 番目が 5 のリストにマッチし、そのリストの 2番目と4番目の値を変数に束縛することができるため、以下のような結果になります。

```
b = 2
c = 4
```

## まとめ

今回は、Scala の制御構文についてまとめました。

基本の制御構文を紹介しましたが、特に for 式や match 式は使いこなすことができれば、コードを短くシンプルに書くことができそうなため実際のコードを書く上で重要になりそうです。
