+++
title="Scala の並列コレクションで処理を高速化する"
date="2022-03-20T21:39:42+09:00"
categories = ["engineering"]
tags = ["scala", "performance", "parallel"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Scala で並列コレクションを用いて処理を高速化する方法についてまとめます。

## 並列コレクションについて

並列コレクションは、Scala 2.9 で導入されたもので、コレクションを並列化して別々のスレッドで処理を実行することができます。

記法も簡単で以下のようにすると並列コレクション扱いになります。

```scala
import scala.collection.parallel.CollectionConverters._

// 通常のコレクション
val list: Seq[Int] = Seq(1,2,3,4,5)

// 並列コレクション
val parallelList: ParSeq[Int] = Seq(1,2,3,4,5).par

// Seqに戻すには以下のようにする
parallelList.seq
```

上記のように、par をつけるだけで簡単に並列コレクションとして扱うことができます

例えば以下のようなコードがあったとします。

```scala
val list: Seq[Int] = // ... 巨大なリスト

val results = list.map(doSomething(_)) // something は時間のかかる処理
```

巨大なリストに対して一定上時間のかかる処理をする場合には、今回紹介したような並列コレクションを用いるとある程度高速化をすることができます。

```scala
val list: Seq[Int] = // ... 巨大なリスト

val results = list.par.map(doSomething(_)).seq // something は時間のかかる処理
```

もちろん処理内容や、環境にによるので参考程度ですが、自分の環境だと3000 文字程度の文字列から NG 記号 (大きめなリスト) が含まれているかといった処理に活用して、2倍以上はスループットが向上しました。

## まとめ

今回は、Scala の並列コレクションについて簡単に紹介しました。
比較的簡単に並列化することができるため処理の高速化をする場合にはまず試してみると良さそうだなと思いました。

### 参考

- {{< exlink href="http://www.ne.jp/asahi/hishidama/home/tech/scala/collection/par.html">}}
