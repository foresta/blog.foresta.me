+++
title="Kotlin で Collection をシャッフルする"
date="2021-02-14T21:09:59+09:00"
categories = ["engineering"]
tags = ["kotlin"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，Kotlin でリストをシャッフルする方法についてまとめます．

## 破壊的シャッフル

Kotlin の Array 型 もしくは，MutableList 型に shuffle というメソッドが用意されているのでこちらを利用します．

```kotlin
fun main() {
    val list = mutableListOf(1,2,3,4,5,6,7)
    list.shuffle()
    println("Shuffled: ${list}")
}
```

これを実行すると以下のような結果が得られます．

```
Shuffled: [7, 5, 2, 6, 3, 4, 1]
```

破壊的な，シャッフルなのでもとのリストを変更するため，List 型 (Immutable) には使用できません（定義されていません）

```kotlin
fun main() {
    val list = listOf(1,2,3,4,5,6,7)
    list.shuffle() // Compile Error!
    println("Shuffled: ${list}")
}

```

```kotlin
fun <T> Iterable<T>.shuffled(): List<T>
```

## 非破壊的シャッフル

Shuffled というメソッドが用意されているのでこちらを利用します．

```kotlin
fun main() {
    val list = listOf(1,2,3,4,5,6,7)
    val shuffledList = list.shuffled()
    println("Shuffled: ${shuffledList}")
    println("Default List: ${list}")
}
```

こちら，非破壊的なシャッフルなので，List 型でも使用でき，シャッフルされた新しい List を返します．
もちろん，もとのリストはそのままになります．

```
Shuffled: [7, 4, 5, 1, 3, 2, 6]
Default List: [1, 2, 3, 4, 5, 6, 7]
```

## シード値を渡す

破壊的なシャッフルも，非破壊的シャッフルもどちらも Random クラスをわたせるためシード値を指定することが出来ます．

```kotlin
import kotlin.random.Random

fun main() {
    val list = listOf(1,2,3,4,5,6,7)
    val seed = 1111L
    val shuffledList = list.shuffled(Random(seed))
    println("Shuffled: ${shuffledList}")
}
```

上記は `1111L` という値を seed 値として Random クラスにわたしています. seed 値が固定なため何度実行しても同じシャッフル結果を得ることが出来ます．

## まとめ

今回は Kotlin で Collection をシャッフルする方法についてまとめました．Kotlin は Collection 周りが充実していてとても便利なので，知るだけでかなり楽にコードをかけるようになります．


### 参考

- {{< exlink href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html" >}}
- {{< exlink href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html" >}}
- {{< exlink href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/" >}}
