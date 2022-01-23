+++
title="Scala入門 その6 コレクション操作"
date="2021-10-31T09:00:00+09:00"
categories = ["engineering"]
tags = ["scala", "collection"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala 入門 その6 ということでコレクション操作についてまとめます。

## Scala に用意されている Collection

Scala の collection は以下のパッケージに所属しています。

- `scala.collection`
- `scala.collection.mutable`
- `scala.collection.immutable`
- `scala.collection.generic`

それぞれのパッケージの中にさまざまなトレイトやクラスが所属しています。

具体的にどんなものがあるかは、公式の{{< exlink href="https://docs.scala-lang.org/overviews/collections-2.13/overview.html" text="こちらのドキュメント" >}} に詳しく記載されています。
Scala で代表的によく使うものとしては、`Seq`, `Set`, `Map` 当たりになると思います。

これらのよく使うものに関しては、エイリアスが用意されていて import などをしなくても使えるようになっています。

```scala
val seq = Seq(1,2,3,4)
```

これらはデフォルトで immutable なものが多く、mutable なものを使用したい場合には、以下のように `scala.collection.mutable` を import して、`mutable.Seq` のように使用することができます。

```scala
import scala.collection.mutable;

object Main extends App {
  val seq = mutable.Seq(1,2,3,4)
}
```

この辺り、immutable な Collection がデフォルトになっているのはとても良さそうです。


上記の Seq ですがこちらはトレイトとなっていて、その実際の実装は List クラスになります。

```scala
val seq = Seq(1,2,3,4)
assert(seq.isInstanceOf[List[Int]])
```

scala-libaray の、scala.collection.immutable.Seq で以下のように、List が使用されていることがわかります。

```scala
/**
  * $factoryInfo
  * @define coll immutable sequence
  * @define Coll `immutable.Seq`
  */
@SerialVersionUID(3L)
object Seq extends SeqFactory.Delegate[Seq](List) {
  override def from[E](it: IterableOnce[E]): Seq[E] = it match {
    case s: Seq[E] => s
    case _ => super.from(it)
  }
}
```

## Initialize

コレクションの初期化は以下のように行います。

```scala
import scala.collection.mutable

object Main extends App {
  val seq = Seq(1,2,3,4)
  val mutableSeq = mutable.Seq(1,2,3,4)
  val map = Map(1 -> "A", 2 -> "B", 3 -> "C")
  val mutableMap = mutable.Map(1 -> "A", 2 -> "B", 3 -> "C")
  val set = Set(1,2,3,4)
  val mutableSet = mutable.Set(1,2,3,4)
}
```

## filter

filter 系の関数は以下の通りです。

```scala
  val seq = Seq(1,2,3,4,5)

  // 偶数のみを抽出
  seq.filter(x => x % 2 == 0)    // => List(2, 4)

  // 奇数のみ (偶数じゃない) を抽出
  seq.filterNot(x => x % 2 == 0) // => List(1, 3, 5)
```

## map

map 系の関数 (と partition) は以下の通りです。

```scala
  val seq = Seq(1,2,3,4,5)

  // x を 2倍する関数を各要素に適用
  seq.map(x => x * 2) // List(2, 4, 6, 8, 10)

  // 0 ~ x までのリストを 全要素分作成
  seq.map(x => 0 to x) // List(Range 0 to 1, Range 0 to 2, Range 0 to 3, Range 0 to 4, Range 0 to 5)

  // 上のリストを平坦化
  seq.flatMap(x => 0 to x) // List(0, 1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 5)

  // x % 2 した値をキーにグループ化し、それぞれ 2倍する  
  seq.groupMap(x => x % 2)(x => x * 2) // Map(0 -> List(4, 8), 1 -> List(2, 6, 10))

  // 偶数のグループと奇数のグループに分ける
  seq.partition(x => x % 2 == 0) // (List(2, 4), List(1, 3, 5))

  // 偶数のグループを 10 倍し、奇数のグループを 100 倍する 
  seq.partitionMap(x => if (x % 2 == 0) Left(x * 10) else Right(x * 100)) // (List(20, 40),List(100, 300, 500))
```

## reduce

reduce 系の関数は以下の通りです。

```scala
  // リストの左から、演算を行う
  seq.reduce((acc, i) => acc - i) // -13
  seq.reduceLeft((acc, i) => acc - i) // -13
  // 1 2 3 4 5
  // (1 - 2) 3 4 5
  // -1 3 4 5
  // (-1 - 3) 4 5
  // -4 4 5
  // (-4 - 4) 5
  // -8 5
  // (-8 - 5)
  // -13

  // リストの右から、演算を行う
  seq.reduceRight((acc, i) => acc - i) // 3
  // 1 2 3 4 5
  // 1 2 3 (4 - 5)
  // 1 2 3 -1
  // 1 2 (3 - -1)
  // 1 2 4
  // 1 - (2 - 4)
  // 1 - -2
  // 3

  // 初期値を指定してリストの左から演算
  seq.fold(10)((acc, i) => acc - i) // -5
  seq.foldLeft(10)((acc, i) => acc - i) // -5
  // 10 1 2 3 4 5 
  // (10 - 1) 2 3 4 5
  // 9 2 3 4 5
  // (9 - 2) 3 4 5
  // 7 3 4 5
  // (7 - 3) 4 5
  // 4 4 5
  // (4 - 4) 5
  // 0 5
  // 0 - 5 = -5

  // 初期値を指定してリストの右から計算
  seq.foldRight(10)((acc, i) => acc - i) // -7
  // 1 2 3 4 5 10
  // 1 2 3 4 (5 - 10)
  // 1 2 3 4 -5
  // 1 2 3 (4 - -5)
  // 1 2 3 9 
  // 1 2 (3 - 9) 
  // 1 2 -6
  // 1 (2 - -6)
  // 1 8
  // 1 - 8
  // -7
```

## まとめ

Scala のおける Collection 操作周りを簡単にまとめました。

基本的な、map , filter , reduce は他の言語同様に使えるのでこの辺りをマスターしておくと良さそうです。

## おまけ

おまけですが、興味があってコレクションのトレイトのデフォルト実装を調べてみていました。

Map のデフォルト実装が HashMap と思って、以下のように assert してみたのですがどうやら HashMap 以外のようだったのが不思議だったので、Scala のソースコードを読んでみました。

```scala
val map = Map(1 -> "A", 2 -> "B", 3 -> "C")
assert(map.isInstanceOf[HashMap[Int, String]]) // => assertion error
```

実装をみてみると、要素数が 1 ~ 4 の時はそれ専用の Map1 ~ Map4 クラスを代わりに使っているようで面白かったです。

```scala
final class Map1[K, +V](key1: K, value1: V)
    extends AbstractMap[K, V] with StrictOptimizedIterableOps[(K, V), Iterable, Map[K, V]] with Serializable {}
final class Map2[K, +V](key1: K, value1: V, key2: K, value2: V)
    extends AbstractMap[K, V] with StrictOptimizedIterableOps[(K, V), Iterable, Map[K, V]] with Serializable {}
class Map3[K, +V](key1: K, value1: V, key2: K, value2: V, key3: K, value3: V) 
    extends AbstractMap[K, V] with StrictOptimizedIterableOps[(K, V), Iterable, Map[K, V]] with Serializable {}
final class Map4[K, +V](key1: K, value1: V, key2: K, value2: V, key3: K, value3: V, key4: K, value4: V)
    extends AbstractMap[K, V] with StrictOptimizedIterableOps[(K, V), Iterable, Map[K, V]] with Serializable {}
```

上記が、定義部分で、`scala/collection/immutable/Map.scala` の、`MapBuilderImpl` クラスにて、Map1 ~ 4 と HashMap の使い分けのコードが書かれています。

```scala
private[immutable] final class MapBuilderImpl[K, V] extends ReusableBuilder[(K, V), Map[K, V]] {
  // ...

  def addOne(key: K, value: V): this.type = {
    if (switchedToHashMapBuilder) {
      hashMapBuilder.addOne(key, value)
    } else if (elems.size < 4) {
      elems = elems.updated(key, value)
    } else {
      // assert(elems.size == 4)
      if (elems.contains(key)) {
        elems = elems.updated(key, value)
      } else {
        switchedToHashMapBuilder = true // => 5 つ目の要素が add されるタイミングで HashMap へスイッチするフラグをつけている
        if (hashMapBuilder == null) {
          hashMapBuilder = new HashMapBuilder
        }
        elems.asInstanceOf[Map4[K, V]].buildTo(hashMapBuilder)
        hashMapBuilder.addOne(key, value)
      }
    }

    this
  }

  // ...
}
```

実際に以下のように要素数によって、別々のクラスが使われていることが確認できました。

```scala
val map1 = Map(1 -> "A")
assert(map1.isInstanceOf[Map1[Int, String]])
val map2 = Map(1 -> "A", 2 -> "B")
assert(map2.isInstanceOf[Map2[Int, String]])
val map3 = Map(1 -> "A", 2 -> "B", 3 -> "C")
assert(map3.isInstanceOf[Map3[Int, String]])
val map4 = Map(1 -> "A", 2 -> "B", 3 -> "C", 4 -> "D")
assert(map4.isInstanceOf[Map4[Int, String]])
val map5 = Map(1 -> "A", 2 -> "B", 3 -> "C", 4 -> "D", 5 -> "E")
assert(map5.isInstanceOf[HashMap[Int, String]])
```

{{< tweet user="kz_morita" id="1454449881066524673" >}}
