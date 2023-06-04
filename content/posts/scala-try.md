+++
title="scala.util.Try について"
date="2023-06-04T23:31:50+09:00"
categories = ["engineering"]
tags = ["scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Scala の `Try` 型についてまとめます。

## scala.util.Try

Scala で例外をハンドリングするためには以下のようなコードで実現できます。

```scala
def div(a: Int, b: Int): Int = {
  try {
    a / b
  } catch {
    case e: ArithmeticException => {
      println(e.getMessage())
      0
    }
    case e: Throwable => throw e
  }
}

println(div(4, 2)) // => 2
println(div(2, 0)) // => 0
```


scala.util.Try というのを使用すると以下のようにかけます

```scala
def div2(a: Int, b: Int): Try[Int] = {
  Try { a / b }
}

println(div2(4, 2)) // Success(2)
println(div2(2, 0)) // Failure(java.lang.ArithmeticException: / by zero)
```

Try 型は、Success or Failure の値を持ち、成功すればその値を Success 型にもち、失敗すれば、Failure 型に自動で例外情報を入れて返してくれます。

そのため以下のようにパターンマッチでハンドリングできます。

```scala
div2(2, 0) match {
  case Success(i) => println(s"success ${i}")
  case Failure(e: Throwable) => println(s"failure: ${e.getMessage()}")
}
// failure: / by zero
```

map や recover などのメソッドもあります。成功時には map の処理が、失敗時には recover 内の処理が実行されます。

```scala
div2(2, 1).map { i => i + 100 }.recover { e => 0 } // => Success(102)
div2(2, 0).map { i => i + 100 }.recover { e => 0 } // => Success(0)
```

get や getOrElse で値を取り出すこともできます。

```scala
div2(2, 1).map { i => i + 100 }.recover { e => 0 }.get // => 102
div2(2, 0).map { i => i + 100 }.recover { e => 0 }.get // => 0

div2(2, 1).map { i => i + 100 }.getOrElse(0) // => 102
div2(2, 0).map { i => i + 100 }.getOrElse(0) // => 0
```

## まとめ

今回は、scala.util.Try についてまとめました。
便利なコンビネータなどが使えるので、積極的に使っていくと良さそうだなと思います。

