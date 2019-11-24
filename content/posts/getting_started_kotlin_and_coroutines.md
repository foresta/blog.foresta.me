+++
title = "KotlinとCoroutineに入門してみた"
thumbnail = ""
tags = ["Kotlin", "coroutine"]
categories = ["engineering"]
date = "2019-11-23"
+++

こんにちは、[kz_morita](https://twitter.com/kz_morita)です。\
これまではずっと iOS をやっていたのですが、最近サーバーサイド Kotlin を書き始めたので今日は Kotlin の Coroutine について勉強がてら軽く触ってみました。

Kotlin 完全に初心者なので、IDE で project を作るところから詳しめに書いていきます。

## 準備

開発環境としては、[IntelliJ IDEA CE](https://www.jetbrains.com/idea/) を使う想定なので、別環境の方は適宜読み替えてください。

まずはプロジェクトを作ります。

File > New > Project...
{{< figure src="/images/posts/getting_started_kotlin_and_coroutines/create_project_1.png" >}}

Gradle で環境を作るので、以下の写真のように Gradle を選択し、 Kotlin/JVM を選択状態で Next を押します。
{{< figure src="/images/posts/getting_started_kotlin_and_coroutines/create_project_2.png" >}}

GroupId に組織名など（個人の場合は適当で良いはず）をいれ、ArtifactIcd にこのアプリ名を入れます。
{{< figure src="/images/posts/getting_started_kotlin_and_coroutines/create_project_3.png" >}}

Project 名と Project のパスを入力して Finish を押します。
{{< figure src="/images/posts/getting_started_kotlin_and_coroutines/create_project_4.png" >}}

上記まででプロジェクトの作成は完了です。

## なにはともあれ Hello World

プロジェクトのソースコードは、 `src/` 以下に入れると良さそうです。今回は Kotlin を利用するので `src/kotlin` 配下にソースコードを入れます。

それでは、以下のような `src/kotlin/Main.kt` というファイルを作り実行してみます。

```kotlin
fun main() {
    println("Hello World")
}
```

main 関数のところに緑色の三角が表示されるので、ここから Run を選択して実行すると、IDE のコンソール状に `Hello World` と表示されるのを確認できるかと思います。
{{< figure src="/images/posts/getting_started_kotlin_and_coroutines/run_project.png" >}}

## Coroutine

それでは早速 Coroutine についてみていきます。

Kotlin の Coroutine は軽量スレッドのようなもので、数千ほどの Coroutine を使用してもパフォーマンス上問題ないとのことです。

coroutine を使うために build.gradle を修正します。

自分の環境の build.gradle を以下に載せます。

```
plugins {
    id 'org.jetbrains.kotlin.jvm' version '1.3.41'
}

group 'me.foresta'
version '1.0-SNAPSHOT'

repositories {
    jcenter()
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.3.2"
}

compileKotlin {
    kotlinOptions.jvmTarget = "1.8"
}
compileTestKotlin {
    kotlinOptions.jvmTarget = "1.8"
}
```

変更点としては、repositories が `jcenter()` となった点と、`kotlinx-coroutines-core` を dependencies に追加したことです。

### launch

Coroutine のはじめとして launch というものを書いてみます。

`launch {}` function で Coroutine を開始でき、コードブロック内に並列に実行する処理を記述できます。

```kotlin
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

fun main() {

    println("Hello")

    GlobalScope.launch {
        println("Hoge")
    }

    GlobalScope.launch {
        println("Fuga")
    }

    println("World")
    Thread.sleep(1000)
}
```

上記を実行すると以下のように毎回違った順番で表示されます。

```
Hello
Hoge
Fuga
World
```

```
Hello
Hoge
World
Fuga
```

Hoge と Fuga を表示する処理が、並列に動いていることがわかると思います。

### delay と suspend function

Coroutine 内の処理を待機させるために `kotlinx.coroutines.delay()` を使用することができます。
スレッド自体を停止する `Thread.sleep` とは違い、`delay` は処理を一時停止して、Thread を Tread pool に戻すといった動きになります。
そのため待機が完了すると復帰時に空いているスレッドで処理が再開されます。

以下に、delay を用いたサンプルコードを記載します。

```kotlin
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

fun main() {

    println("Hello")

    GlobalScope.launch {
        delay(1000)
        println("Hoge")
    }

    Thread.sleep(2000)
    println("World")
}
```

上記コードを実行すると、1 秒おきに、`Hello` → `Hoge` → `World` と表示されるはずです。

ここで、`delay` function を `launch {}` のコードブロックの外、つまり main 関数直下から呼び出してみます。

```kotlin
import kotlinx.coroutines.delay

fun main() {

    println("Hello")

    delay(1000) // ← ここでビルドエラー
    println("Hoge")

    Thread.sleep(2000)
    println("World")
}
```

すると以下のようなエラーメッセージが表示されます。

```
Suspend function 'delay' should be called only from a coroutine or another suspend function
```

この delay という関数は、suspend function と呼ばれるもので `中断可能` な関数となります。
suspend function は Coroutine の内部 (または他の suspend function 内部)でしか使用できないため、上記のようなビルドエラーがでます。

### runBlocking

並列ではなく直列で処理は行いたいが、suspend function を使用したいと言った場合には、`runBlocking {}` を使用します。
こちらを用いれば、Coroutine 内の処理が終わるまでブロックしてくれるため、実質直列な処理が実現できます。

さきほどのサンプルコードを runBlocking を用いて書き直してみます。

```kotlin
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking

fun main() {

    println("Hello")

    runBlocking {
        delay(1000)
        println("Hoge")
    }

    Thread.sleep(2000)
    println("World")
}
```

上記を Run すると無事ビルドができ、`Hello` → 1 秒 → `Hoge` → 2 秒 → `World` といった出力がされます。
Hoge と World の間に 2 秒間あることから、runBlocking で処理がブロックされていることがわかります。

### suspend function を定義する

これまでで、`delay` が suspend function であることを紹介しましたが、suspend function を自分で定義することももちろん可能です。

以下のように suspend という修飾子をつけます。

```kotlin
// 1秒待って引数を return するだけの関数
suspend fun lazy(n: Int): In {
    delay(1000)
    return n
}
```

以下に suspend function を定義したサンプルコードを記載します。

```kotlin
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

suspend fun lazy(n: Int): Int {
    delay(1000)
    return n
}

fun main() {

    println("Hello")

    GlobalScope.launch {
        println("lazy value is %d".format(lazy(2)))
    }

    Thread.sleep(2000)
    println("World")
}
```

以下のような表示が、各行 1 秒間ごとに出力されるかと思います。

```
Hello
lazy value is 2
World
```

### Async / Await

Coroutine で処理した内容が終わったタイミングで待ち合わせしたい場合には、 `Async` / `Await` を使用します。

以下にサンプルコードを記載します。

```kotlin
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking

// timeMills ms 後に n を返す
suspend fun lazy(n: Int, timeMills: Long): Int {
    delay(timeMills)
    return n
}

fun main() {

    println("Hello")

    val a = GlobalScope.async { lazy(4, 2000) }
    val b = GlobalScope.async { lazy(6, 3000) }

    runBlocking {
        println("a + b = %d".format(a.await() + b.await()))
    }

    println("World")
}
```

上記のコードでは、2 秒間かけて a (= 4) を取得して、 3 秒間かけて b (= 6) を取得して、その結果を待ち合わせしてたし算をするといったケースを想定しています。複数の API 呼び出しをした結果をまとめて処理するみたいなケースに用いられることが多そうなケースですね。

このコードを実行すると、`Hello` → 3 秒後 `a + b = 10` → `World` のように表示されます。

より具体的にみていくと、`GlobalScope.async {}` を読んだ時に返されるのは、`Deffered<T>` 型になり、T は `async {}` のコードブロックないで返す値の型になります。上記の例で言うと、Int ですね。

そして `await` はこの `Deffered<T>` 型のメソッドで Coroutine が終了し、値が返されるまで待つことができます。
また、この `await` も suspend function にであり、下記のように定義されています。(コメント部分は省略しています)

```kotlin
public interface Deferred<out T> : Job {

    public suspend fun await(): T

    // ...
}
```

そのため、`await` を呼び出すのも、Coroutine 内、もしくは suspend function ないである必要があります。

## まとめ

今回は Kotlin の Coroutine を簡単に紹介しました。非同期系の処理は昨今のプログラミングにおいてよく登場すると思いますが Coroutine のように公式のライブラリとして用意されているのはすごく良いと思います。

今回紹介した内容は公式のドキュメントにも記載されていて、ドキュメントも充実してそうだったのでより詳しく知りたい方は公式ドキュメントを参照してみてください。

- [リファレンス](https://kotlinlang.org/docs/reference/)
- [Coroutines](https://kotlinlang.org/docs/reference/coroutines-overview.html)
