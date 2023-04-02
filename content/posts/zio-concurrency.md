+++
title="Scala と ZIO による並行処理"
date="2023-04-03T01:45:00+09:00"
categories = ["engineering"]
tags = ["scala", "zio", "concurrency"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Scala 向けの非同期処理ライブラリである ZIO について主に並行処理の使い方についてメモします。

## 主な並行処理

ZIO を用いて、並行処理のためのメソッドを以下に列挙します。

- ZIO#zip, ZIO#zipPar
- ZIO#zipWith, ZIO#zipWithPar
- ZIO#tupled, ZIO#tupledPar
- ZIO#foreach, ZIO#foreachPar
- ZIO#reduceAll, ZIO#reduceAllPar
- ZIO#mergeAll, ZIO#mergeAllPar

suffix に Par をつけると並列実行となります。

以下のような ZIO を返すメソッドで考えます。

```scala
private def numSeq(): ZIO[Clock, Throwable, Seq[Int]] = for {
    _ <- ZIO.effect(println("numSeq start"))
    _ <- zio.clock.sleep(1.seconds)
    _ <- ZIO.effect(println("numSeq end"))
} yield Seq(1,2,3,4,5)

private def stringSeq(): ZIO[Clock, Throwable, Seq[String]] = for {
    _ <- ZIO.effect(println("stringSeq start"))
    _ <- zio.clock.sleep(1.seconds)
    _ <- ZIO.effect(println("stringSeq end"))
} yield Seq("a","b","c","d","e")
```

### ZIO#zip, ZIO#zipPar

zip は、２つの ZIO を返すメソッドの結果を 2要素の tuple にして返します。

```scala
    numSeq().zip(stringSeq())
```

結果は以下の感じ
```
numSeq start
numSeq end
stringSeq start
stringSeq end
(List(1,2,3,4,5), List(a, b, c, d, e))
```

zipPar は、上記を並行で実行します。

```scala
    numSeq().zipPar(stringSeq())
```
```
numSeq start
stringSeq start
stringSeq end
numSeq end
(List(1,2,3,4,5), List(a, b, c, d, e))
```

### ZIO#zipWith, ZIO#zipWithPar

zipWith は、結果を merge する `(A, B) => C` となるメソッドを第二引数に取る zip です。

```scala
    numSeq().zipWith(stringSeq())((nums, strings) => nums.zip(strings))
```

結果は以下の感じです。
```
numSeq start
numSeq end
stringSeq start
stringSeq end
List((1, a),(2, b),(3, c),(4, d),(5, e))
```

zipWithPar

```scala
    numSeq().zipWith(stringSeq())((nums, strings) => nums.zip(strings))
```
```
numSeq start
stringSeq start
stringSeq end
numSeq end
List((1, a),(2, b),(3, c),(4, d),(5, e))
```

### ZIO#tupled, ZIO#tupledPar

tupled は、ほぼ zip と似てますが、複数の要素も tuple で返すことができます。

```scala
    ZIO.tupled(numSeq(), stringSeq())
```

結果は以下の感じです。
```
numSeq start
numSeq end
stringSeq start
stringSeq end
(List(1,2,3,4,5), List(a, b, c, d, e))
```

tupledPar

```scala
    ZIO.tupledPar(numSeq(), stringSeq())
```
```
numSeq start
stringSeq start
stringSeq end
numSeq end
(List(1,2,3,4,5), List(a, b, c, d, e))
```

### ZIO#foreach, ZIO#foreachPar

foreach は、Collection をとって ZIO を返すような挙動ができます。

```scala
    ZIO.foreach(Set(1,2,3))(_ => numSeq())
```

結果は以下のように、numSeqメソッドを 3 回実行します。

```
numSeq start
numSeq end 
numSeq start
numSeq end 
numSeq start
numSeq end 
Set(List(1,2,3,4,5))
```

foreachPar で並行処理です。

```
numSeq start
numSeq start
numSeq start
numSeq end 
numSeq end 
numSeq end 
Set(List(1,2,3,4,5))
```

### ZIO#reduceAll, ZIO#reduceAllPar

reduceAll は、複数の ZIO を処理して１つの結果を返します。

```scala
    ZIO.reduceAll(ZIO.succeed(Nil), Seq(numSeq(), numSeq(), numSeq())) { (num1, num2) =>
        num1 ++ num2
    }
```

```
numSeq start
numSeq end 
numSeq start
numSeq end 
numSeq start
numSeq end 
List(1,2,3,4,5,1,2,3,4,5,1,2,3,4,5)
```

reduceAllPar

```scala
    ZIO.reduceAll(ZIO.succeed(Nil), Seq(numSeq(), numSeq(), numSeq())) { (num1, num2) =>
        num1 ++ num2
    }
```

```
numSeq start
numSeq start
numSeq start
numSeq end 
numSeq end 
numSeq end 
List(1,2,3,4,5,1,2,3,4,5,1,2,3,4,5)
```

### ZIO#mergeAll, ZIO#mergeAllPar

mergeAll は、複数の ZIO を merge した値を返します。

```scala
    ZIO.mergeAll(Seq(numSeq(), stringSeq(), numSeq()))(Seq[String]()) { (acc, num) =>
        acc ++ num.map(_.toString)
    }
```

```
numSeq start
numSeq end 
stringSeq start
stringSeq end 
numSeq start
numSeq end 
List(1,2,3,4,5,a,b,c,d,e,1,2,3,4,5)
```

mergeAllPar

```scala
    ZIO.mergeAllPar(Seq(numSeq(), stringSeq(), numSeq()))(Seq[String]()) { (acc, num) =>
        acc ++ num.map(_.toString)
    }
```

```
numSeq start
numSeq start
stringSeq start
stringSeq end 
numSeq end 
numSeq end 
List(a,b,c,d,e,1,2,3,4,5,1,2,3,4,5)
```

並行でなげるので早くおわる `stringSeq` が先に List に入っているため順序が変わってます。


## まとめ

今回は、ZIO の並行処理周りをまとめました。
非同期処理を書く際に、なれると ZIO 使いやすいためどんどん使っていきたいなと思います。
