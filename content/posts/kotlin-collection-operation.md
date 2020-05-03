+++
title="Kotlin におけるリスト操作"
date="2020-05-04T07:00:00+09:00"
categories = ["engineering"]
tags = ["kotlin", "collection"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Kotlin で List, Map, Set などのコレクション操作する際によく使うものをまとめてみます。
要素のフィルタリングや、map、ソートや重複を削除する方法などを載せていきます。

## Initialize

初期化系の処理をまとめます。

##### List の初期化

```kt
listOf(1,2,3,4) // => [1,2,3,4]
```

##### Map の初期化

```kt
mapOf(1 to "one", 2 to "two", 3 to "three") // => {1=one, 2=two, 3=three}
```

##### Set の初期化

```kt
setOf(1,2,3,3) // => [1,2,3]
```

##### mutable な Collection

基本的に、上記の `listOf` , `mapOf` , `setOf` は Immutable な Collection なので、後から変更したい場合は、`ImmutableXXXOf()` を使用します。

```kt
val mutableList = mutableListOf(1,2,3,4)
mutableList.add(5) // => [1, 2, 3, 4, 5]

val mutableMap = mutableMapOf(1 to "one", 2 to "two", 3 to "three")
mutableMap[1] = "いち" // {1=いち, 2=two, 3=three}

val mutableSet = mutableSetOf(1,2,3)
mutableSet.remove(1) // [2, 3]
```

## filter

値のフィルタリングを行います。

```kt
listOf(1,2,3,4,5).filter { it > 2 } // => [3,4,5]
```

Null の値を除外したい場合は以下のように行います。

```kt
listOf(1,2,null,4,5,null).filterNotNull() // => [1,2,4,5]
```

## map

リストの各要素を変換した新しいリストにマッピングします。

```kt
// 各要素を2倍
listOf(1,2,3,4,5).map { it * 2} // => [2, 4, 6, 8, 10]

// 2 より大きければ 2 倍し、それ以外なら null にする
listOf(1,2,3,4,5).map { if (it > 2) { it * 2 } else { null } } // => [null, null, 6, 8, 10]

// null 値を除外しつつ map する
listOf(1,2,3,4,5).mapNotNull { if (it > 2) { it * 2 } else { null } } // => [6, 8, 10]

// index 付きで map を行う (index to i は Pair 型をつくるシンタックスシュガー)
listOf(1,2,3,4,5).mapIndexed { index, i -> index to i } // => [(0, 1), (1, 2), (2, 3), (3, 4), (4, 5)]
```

## reduce

リストの要素を順番に演算していきます。acc はアキュムレータで演算の結果が保持されます。

```kt
// リストの左から、演算を行います。
listOf(1,2,3,4,5).reduce { acc, i -> acc - i } // => -13
// 1
// (1) - 2
// (1 - 2) - 3
// (1 - 2 - 3) - 4
// (1 - 2 - 3 - 4) - 5 = -13

// リストの右から、演算を行います。
listOf(1,2,3,4,5).reduceRight { acc, i -> acc - i } // => 3
// 1
// 2 - (1)
// 3 - (2 - 1)
// 4 - (3 - (2 - 1))
// 5 - (4 - (3 - (2 - 1))) = 3
```

## sort

```kt
// 昇順ソート
listOf(1,3,5,2,6,7).sorted() // => [1, 2, 3, 5, 6, 7]

// 降順ソート
listOf(1,3,5,2,6,7).sortedDescending() // => [7, 6, 5, 3, 2, 1]

// 偶数 => 奇数 の順番にソート
listOf(1,2,3,4,5).sortedBy { it % 2 } // => [2, 4, 1, 3, 5]

// 奇数 => 偶数 の順番にソート
listOf(1,2,3,4,5).sortedByDescending { it % 2 } // => [1, 3, 5, 2, 4]
```

## 重複を削除

```kt
listOf(1,1,2,3,4,4).distinct() // => [1, 2, 3, 4]

// 3で割ったあまりの数で重複判定をする
listOf(1,2,3,4,5,6,7,8,9,10).distinctBy { it % 3 } // => [1, 2, 3]
```

## 変換

### List → Set, Set → List

```kt
// List → Set
// 重複も削除される
listOf(1,2,3,4,4,5).toSet() // [1,2,3,4,5]

// Set → List
setOf(1,2,3,4,5).toList() // [1,2,3,4,5]
```

### List → Map

```kt
// Pair を作ってから Map へ
listOf(1,2,3,4,5).map { it - 1 to it }.toMap()   // => {0=1, 1=2, 2=3, 3=4, 4=5}

// 直接 Map へ
listOf(1,2,3,4,5).associateBy({ it - 1 }, { it } // => {0=1, 1=2, 2=3, 3=4, 4=5}
```

### Map → List

```kt
val map = mapOf(1 to "one", 2 to "two", 3 to "three")

// 値のみの List
map.values // => ["one", "two", "three"]: Collection<String>
map.values.toList() // => ["one", "two", "three"]: List<String>

// キーのみの List
map.keys  // => [1, 2, 3]: Set<Int>
map.keys.toList()  // => [1, 2, 3]: List<Int>

// Pair の List
map.toList() // => [(1, "one"), (2, "two"), (3, "three")]: List<Pair<Int, String>>
```

## まとめ

Kotlin での Collection の操作周りについてまとめました。最近の言語っぽく一通りの便利なメソッドはそろっているので、Collection の操作で困ることはあまりない印象です。

Collection の操作をマスターするとグッとコードを書くスピードが上がるので、ここらへんが気持ちよく書ける Kotlin はなかなか開発しやすいと思いました。
