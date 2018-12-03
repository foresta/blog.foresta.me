+++
categories = ["mathematics"]
date = "2018-12-06T09:00:35+09:00"
title = "SwiftのEnumと代数的データ型"
thumbnail = ""
tags = ["swift", "advent-calendar"]

draft = true
+++

この記事は[NewsPicks Advent Calendar 2018](https://qiita.com/advent-calendar/2018/newspicks)の6日目の記事です。

## はじめに

皆さんこんにちは。\
NewsPicksでソフトウェアエンジニアをしている [@kz_morita](https://twitter.com/kz_morita)です。

NewsPicksには11/1にjoinしたので約一ヶ月ほどたったという状態です。\
私は、これまでずっとスマートフォンゲーム開発 (サーバーとクライアント両方) やってきたのですが、現在はiOSエンジニアとして働かせてもらっています。

初めてのiOS/Swiftということでいろいろキャッチアップ中なのですが、色々触っていく中でSwiftのEnumは面白いなと感じることがあったのでそのことについて書いていこうかなと思います。


## Swift の Enumについて

Swiftにもいわゆる列挙型としてのEnumが存在します。\

大きく分けると以下の3通りになるかと思います。

* 通常の列挙型Enum
* 値型のEnum (Raw Value)
* 関連値を持つEnum (Associated Value)

一つずつ簡単に紹介します。

### 通常のEnum

いわゆる普通の列挙型です。

```swift
enum Color {
    case Red, Blue, Green
}
```

### Raw Value

値を持つことができる列挙型です。 \
`enum Name: Type` のように定義します。

```swift
enum Color: String {
    case red = "red"
    case blue = "blue"
    case green = "green"
}

// rawValueで値にアクセスできる
Color.red.rawValue // => "red"
```

```swift
// 省略もできる
enum Color: String {
    case red, blue, green
}

Color.red.rawValue // => "red"
```

### Associated Value

関連値をもつ異なる型を一つのEnum型に持つことができます。
[Swiftの公式ページ](https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html)からバーコードの例を引用します。

```swift
enum Barcode {
    case upc(Int, Int, Int, Int)
    case qrCode(String)
}

// Barcode型の変数に.upc, .qrCode両方を代入可能
var productBarcode: Barcode = Barcode.upc(8, 85909, 51226, 3)
productBarcode = Barcode.qrCode("ABCDEFGHIJKLMNOP")

// それぞれの値はパターンマッチのようにとりだせる。
switch productBarcode {
case .upc(let numberSystem, let manufacturer, let product, let check):
    print("UPC: \(numberSystem)., \(manufacturer), \(product), \(check).")
case .qrCode(let productCode):
    print("QR code: \(productCode)")
}
```

---

これらSwiftのEnumの種類の中でもAssociated Valueが `代数的データ型 (直和型)` の性質があるのが非常に良いなと思いました。(今回のテーマ)

## 代数的データ型とはなにか

代数的データ型には、直積型、直和型、列挙型があると認識しています。

* 直積型 (struct, classなど)
* 直和型 (Associated ValueのEnum)
* 列挙型 (通常のEnum)

上記の３つの型についてそれぞれが取りうる値の数に注目して見ていこうと思います。\

### 型が取りうる値の数について

その前にまず代表的なプリミティブ型の取りうる値について見ていきます。

たとえば、`Bool` 型の場合、`True` or `False` のふた通りの値が取り得ます。
これを本記事では以下のように表すことにします。

$
N(Bool) = 2
$

同様に他の型についても見ていくと以下のようになるかと思います。

$N(Int8) = 256$

$N(String) = ∞$

以上を踏まえた上で上記の３つの型についてそれぞれが取りうる値の数について見ていこうと思います。



### 直積型 (struct)

以下のstructで考えることにします。

```swift
struct Sample1 {
    let a: Bool
    let b: Bool
    let c: Bool
}
```

上記のSample1の取りうる値について列挙すると以下のようになります。

```swift
var sample = Sample(a: true, b: true, c: true)
sample = Sample(a: true, b: true, c: false)
sample = Sample(a: true, b: false, c: true)
sample = Sample(a: true, b: false, c: false)
sample = Sample(a: false, b: true, c: true)
sample = Sample(a: false, b: true, c: false)
sample = Sample(a: false, b: false, c: true)
sample = Sample(a: false, b: false, c: false)
```

合計で8通りあり、以下のような式になります。

$$
N(Sample) = N(Bool) * N(Bool) * N(Bool)
= 2 * 2 * 2
= 8
$$

struct (やclassなど) はそれぞれのメンバ型の取りうる値を集合とみなした場合に、それ自身の取りうる値は、メンバ型同士の直積集合をとったものとなります。

### 直和型 (Associated Type)

以下のようなAssociated TypeのEnumを考えます。

```swift
enum SampleEnum {
    case sample1(Bool, Bool)
    case sample2(Int8)
}
```

列挙していくと以下のようになります

```swift
SampleEnum.sample1(true, true)
SampleEnum.sample1(true, false)
SampleEnum.sample1(false, true)
SampleEnum.sample1(false, false)
SampleEnum.sample2(N) // 128通り
```

つまり、取りうる値の数は以下のようになります。

$N(.sample1(Bool, Bool)) = 4$ \
$N(.sample2(Int8)) = 256$ \
$N(SampleEnum) = N(.sample1) + N(.sample2) = 260$

これはEnumの要素である各々が取りうる値の直和となります。\
(.sample1が直積なので、直積の直和ともいえます)

### 列挙型

それでは通常の列挙型はどうでしょう。

```swift
enum Color {
    case Red, Blue, Green
}
```

これらの列挙型の要素Red/Blue/Greenはそれぞれメンバを0個 (引数0のコンストラクタを) もつ型だと見なせます。\
つまり上記の直和型でみたものの亜種と考えられそうです。
実際に取りうる値の数を見てみると

$N(Color.Red) = 1$ \
$N(Color.Blue) = 1$ \
$N(Color.Green) = 1$ \

となり、

$N(Color) = 3$

となります。

## 直和型のメリット

これまで三つの型を見てきましたが、直和型を有効に使っていくことが非常に重要だなと思っています。
直和型(Associated Value)のメリットについて書いていきます。

具体的にはResultパターンなどは直和型で表現するのに適しています。
ここではなにかのAPIなどを叩いて、結果を取得するような例を考えます。

まずは結果を表すstruct (直積型) を考えます。

```swift
struct Result<T> {
    var value: T?
    var error: Error?
}

enum MyError: Error {
    case err
}

let res = Result(value: "user1", error: nil)
if let value = res.value {
    // valueがあればSuccess
    print(value)
}
else if let err = res.error {
    // valueがなくerrがあればError
    print(err)
}
```

上記は一見要件を満たしていそうですが、問題もあります。
`Result<T>`型は `.value == nil && .error == nil` または、`.value != nil && .error != nil` という値も取り得てしまいます。

次にこの問題を解決するために、Associated Value (直和型) で表現してみます。

```swift
enum Result<T> {
    case success(_ value: T)
    case failure(_ error: Error)
}

enum MyError: Error {
    case err
}

var res = Result.success("user1")
switch res {
case .success(let value):
    print(value)
case .failure(let err):
    print(err)
}
```

このようにAssociated Valueで表現することで実際のユースケースと型が一致し、シンプルに要件を満たすことができたかと思います。

## まとめ

一般的に型に余分な値が入る余地があるということはそれだけエラーが起きる可能性が増え、またそれを防ぐためのエラーハンドリングが必要になることを意味しています。\
直和型をサポートしている言語はそこまで多くありません (Haskell, OCaml, Rust, Elm, TypeScript, C++, etc...) が、
非常に強力な仕組みなのでうまく利用してシンプルかつ堅牢なシステムをつくることが重要だなぁと思います。


## さいごに

NewsPicksはiOSの開発を一緒に開発していただけるメンバーを募集しています。\
世の中にインパクトを与えるようなアプリを作っていきたい方を大歓迎していますので、お気軽に[ご連絡](https://www.wantedly.com/companies/newspicks/projects)していただけると幸いです。

