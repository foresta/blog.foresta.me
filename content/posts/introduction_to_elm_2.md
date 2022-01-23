+++
title = "Elmに入門してみた その2"
thumbnail = ""
tags = ["elm"]
categories = ["engineering"]
date = "2018-09-30"
+++

Elmに入門してみましたのでそのメモです。\
今回はElmの型についてまとめてみました。

[その1はこちら](/posts/introduction_to_elm)

## 環境

私の環境が以下のような構成のため、それを想定した記事となっています。

* OSX High Sierra
* elm 0.19.0
* vim 8.1 

## Elmの型

Elmの型について以下の4つをまとめていきます。

* Type Annotations
* Type Alias
* Custom Type
* Cardinality

### Type Annotations

型アノテーションをメソッドや変数につけられる

```elm
-- 変数
num : Int
num =
  3

-- 関数
square : Int -> Int
square n =
  n^2

distance : { x : Float, y : Float } -> Float
distance { x, y } =
    sqrt (x^2 + y^2)
```

### Type Alias

型に別名をつけられる

```elm
type alias Name = String
type alias Age = Int

user : (Name, Age)
user =
  ("Tom", 26)


type alias Point = { x : Float, y : Flaot }
origin : Point
origin =
  { x = 0, y = 0 }

distance : Point -> Float
distance p =
    sqrt (p.x^2 + p.y^2)
```

### Custom Type

```elm
type Color = Red | Yellow | Green
```

Bool や Maybe などもCustom Type として表現できる。

```elm
type Bool = True | False
type Maybe a = Just a | Nothing
type Result error value
  = Ok value
  | Err error
```

ちなみにResult型は `String.toInt` などで使用されている
(elm-lang/core/5.11/String)

```elm
-- result型
type Result error value
  = Ok value
  | Err error

-- toIntの定義
String.toInt : String -> Result String Int

-- toIntの使用例
String.toInt "123" == Ok 123
String.toInt "-10" == Ok -10
String.toInt "abc" == Err "could not convert string 'abc' to an Int"
```

### 型とcardinalityについて

参考: https://guide.elm-lang.org/appendix/types_as_sets.html

Elmでは無効なデータの余地を残さないようにコーディングすることが推奨されています。\
そうすることにより、データに不正な値が入りづらくなりランタイムエラーが起きにくくなります。

どういうことかを理解するには、TypeとSetの関係性を理解することが必要になってきます。

```
Bool is the set  { True, False }
Color is the set { Red, Yellow, Green }
Int is the set { ..., -2, -1, 0, 1, 2, ...}
Float is the set { ... 0.9, 0.99, 0.999, ..., 1.0, ... }
String is the set { "", "a", "aa", ..., "hello", ... }
```

上記の通り、Bool型はTrueとFalseの集合だし、Intは整数の集合です。

型を定義するということはつまり、データの取りうる値の範囲を定義することと言えます。

#### Cardinality

https://guide.elm-lang.org/ には Cardinality(基数)という概念が紹介されていて、その型の取りうる値の数を表しています。

具体例をだすと以下のような感じです。

```
cardinality( Bool ) = 2
cardinality( Color ) = 3
cardinality( Int ) = ∞
cardinality( Flaot ) = ∞
cardinality( String ) = ∞
```

#### Multiplication

TupleやRecordの cardinality は乗算されます。どういうことかというと、

```elm
-- (Bool, Bool) のTuple
cardinality( (Bool, Bool) ) = cardinality( Bool ) * cardinality( Bool ) = 2 * 2 = 4

-- { x: Bool, y: Bool } の Record
cardinality( { x : Bool, y : Bool }) = cardinality( Bool ) * cardinality( Bool ) = 2 * 2 = 4
```

つまり各要素の取りうる全パターンが、cardinalityとなるということですね。

#### Addition

Custom Typeでは、cardinalityが加算されます。

具体的には、

```
cardinality( Result Bool Color ) = cardinality( Bool ) + cardinality( Color ) = 2 + 3 = 5
cardinality( Maybe Bool ) = 1 + cardinality( Bool ) = 1 + 2 = 3
```

ちなみに、Maybe Bool が `1 + cardinality( Bool )` になっているのは、Maybeが以下のような定義だからです。

```elm
type Maybe a = Just a | Nothing
```

型を定義するときにcardinalityが少なくなるようにすると、想定外のデータに対するエラーチェックをしなくてすむようになります。余計なチェックがいらないため、コードを短くシンプルにより信頼性の高いコードにすることができます。

Additionはcardinalityが小さくとどめるために非常に重要な要素となります。

具体的な例を紹介します。\
`Maybe Bool` 型をAdditionを使わずに表現しようとすると、値が存在するかどうかのBool と 値としてのBoolの二つをもつことになります。(ここではRecordで表現します)

まずはRecordで表現した例。 \
cardinality({ exists : Bool, value : Bool }) = 4
```elm
-- データの定義
result : { exists : Bool, value : Bool)

-- 使う側
-- 誤ってelse句の中で result.valueを使ってしまうと意図しない挙動になってしまう
if result.exists then
    -- result.valueをつかってよい
else
    -- result.valueは無効な意味のない値

```

そして、Maybe Bool で表現した例。 \
cardinality( Maybe Bool ) = 3

```elm
-- データの定義
result : Maybe value

-- 使う側
-- 無効なデータが混入しない
case result of
  Nothing ->
    "result value is nothing"
  Just value ->
    value
```

上記の例でCustom Type (Maybe) を使用することで、無効なデータが入る余地がなくなり堅牢なコードに近づくことができたのではないでしょうか？


このAdditionですが、他の言語でサポートしている言語はそんなに多くないらしいです。\
そんな中RustのEnumはAdditionができるためcardinalityを小さくすることが可能になり素晴らしいとelmの公式で褒められていました。(Rustやりたくなってきた)

{{< tweet user="kz_morita" id="1042190921008209920" >}}

## まとめ

Elmの型についてまとめました。
cardinalityという概念はいままで触れたことがなく、非常に面白かったです。\
他の言語との比較のところで、「JavaScriptはObject型としてなんでも入るため無効なデータが入る余地が多く注意深くバリデーションを書かないと実行時エラーを起こしやすい」という風に紹介されていたのですが、これは非常に身に覚えがある例で面白かったです。

いままでオブジェクト指向にのっとりプログラムを書くことが非常に多かったため、\
データ設計でプログラムを堅牢にしていく考え方は非常に興味深くElm (や他の関数型言語) は面白いなぁと思いました。

## 参考にしたサイト

* https://elm-lang.org/docs
* https://guide.elm-lang.org/
* http://rundis.github.io/blog/2016/elm_maybe.html
