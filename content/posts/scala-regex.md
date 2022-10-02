+++
title="Scala の Regex で全角半角を無視して match する方法"
date="2022-10-02T21:45:57+09:00"
categories = ["engineering"]
tags = ["scala", "regex", "case-sensitive", "ignorecase"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Scala の正規表現まわりで全角半角を無視して match させる方法についてまとます。

## 基本的な使い方

Scala では、Regex クラスを用います。

- {{< exlink href="https://docs.scala-lang.org/ja/tour/regular-expression-patterns.html" >}}
- {{< exlink href="https://www.scala-lang.org/api/2.13.4/scala/util/matching/Regex.html" >}}

以下に、jpg という拡張子を削除するような正規表現を示します。

```scala
import scala.util.matching.Regex

val regex = """\.jpg""".r
val replace = (str: String) => regex.replaceAllIn(str, "")

println(replace("image.jpg")) // => image
```

一般的な正規表現で全角半角を無視するためには i という修飾子をつけます。
今回の例では `/\.jpg//i` のような感じです。

Scala の Regex ではこのような修飾子は以下のように正規表現の頭につけます。

```scala
val regex = """(?i)\.jpg""".r
```

ためしに、以下のようなコードを実行すると期待した動きになります。

```scala
import scala.util.matching.Regex

val regex = """(?i)\.jpg""".r
val replace = (str: String) => regex.replaceAllIn(str, "")

println(replace("image.jpg")) // => image
println(replace("image.JPG")) // => image
```

ほかにも以下のような修飾子が使用できそうです。

`i`, `d`, `m`, `s`, `u`, `x`

使用できる修飾子は、Java の Pattern クラスで使用できるものと同様なようです。

https://docs.oracle.com/javase/6/docs/api/java/util/regex/Pattern.html#special

## まとめ

今回は、Scala の 正規表現で全角半角を無視して match する方法についてまとめました。
よく見る `/\.jpg//i` のような末尾に修飾子を書くようなフォーマットは使用できないのですが、同じような修飾子は使えそうです。よく使いそうな機能なのでメモとして残しておきます。