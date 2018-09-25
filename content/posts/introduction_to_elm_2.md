+++
title = "Elmに入門してみた その2"
thumbnail = ""
tags = ["elm"]
categories = ["engineering"]
date = "2018-09-23"
draft = true
+++

Elmに入門してみましたのでそのメモです。\
[その1はこちら](/posts/introduction_to_elm)

## 環境

私の環境が以下のような構成のため、それを想定した記事となっています。

* OSX High Sierra
* elm 0.19.0
* vim 8.1 

## Elmの型

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
```

### Custom Type

```elm
type alias Name = String
type alias Age = Int

type User 
  = Regular Name Age
  | Visitor Name

taro = Regular "Taro" 26
hanako = Visitor "Hanako"
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

https://guide.elm-lang.org/appendix/types_as_sets.html

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
