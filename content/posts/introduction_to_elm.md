+++
title = "Elmに入門してみた その1"
thumbnail = ""
tags = ["elm"]
categories = ["engineering"]
date = "2018-09-23"
+++

## 背景

フロントエンドの技術を何か身に付けたいなぁと考えていた時、[Rebuild.fm#214](http://rebuild.fm/214/)でElmの話をきき良さそうだなと思い軽く触ってみました。


私のスペックとしては、サーバーやゲームのクライアントがかけるエンジニアで、JSは書けるけどReactやVueなどのフレームワークは触ったことがないくらいのレベルです。

また、関数型言語についてもElixirやlispを少し触ったことがあるくらいでそこまでガッツリ触ったことがないというレベルです。

今回は公式のガイドやドキュメントを眺めて得た知識を簡単にまとめます。

その1ということで簡単に、シンタックスなどをまとめます。

## 環境

私の環境が以下のような構成のため、それを想定した記事となっています。

* OSX High Sierra
* elm 0.19.0
* vim 8.1 

## Elmとは？

ElmはJavaScriptにコンパイルできる関数型言語で、Reduxの元になった言語と言われてます。\
仮想DOMを標準でサポートしています。\
また、Elm Architectureというアーキテクチャを言語レベルで定めているのも面白い一面かなと思います。

## インストール

### Elm

brewで一発

```bash
$ brew install elm
```

インストールすると以下のツールが手に入ります。

* elm repl
* elm reactor
* elm init
* etc...

### vim 

[elmcast/elm-vim](https://github.com/ElmCast/elm-vim)を入れてます。


vim 上で使えるようにするため、フォーマッタなどを入れます。

```bash
# vim上でunit testできるようにするやつ
$ npm install -g elm-test

# コード補完とdocument
$ npm install -g elm-oracle

# フォーマッタ
$ npm install -g elm-format 
```

パッケージ管理にはdeinを使っています。適宜読み替えてください。
```
call dein#add('elmcast/elm-vim')
```

## 文法

### 基本

コメントアウト

```elm
-- 行コメントアウト

{-
複数業コメントアウト
    {- ネストもできる -}
-}

{--}
add x y = x + y
--}
-- 最初の行の } を消すと、add ~ の行をコメントアウトできる
```

### 値

```
Int     1
Float   3.14
number (IntかFloat)
Bool    True or False
Char    'a'
String  "abc"
```

#### List
```elm
[1,2,3,4]
1 :: [2,3,4] 
1 :: 2 :: 3 :: 4 :: []
```

#### Records
```elm
-- 作成
point = { x = 3, y = 5 }

-- アクセス
point.x -- => 3
point.y -- => 5
.x point -- => 3

-- 更新
{ point | x = 100 } -- => { x = 100, y = 5 }
```

#### Tuple
```elm
-- 作成
point = (3, 4)
persion = ("Bob", 24)

-- アクセス
Tuple.first point -- => 3
Tuple.second point -- => 4
point = (3)
Tuple.second point -- => Error
```

Tupleは扱いを間違えると実行時エラーが出るし、firstとsecondしかサポートされていないので、できるだけListやRecordを利用した方が良いのかなぁと感じました。

### 演算子

```elm
> 1 + 2 * 3
7

> (1 + 2) * 3
9

> 5 / 2
2.5

> 5 // 2
2

> 5 / 2
2.5

> 5 // 2
2

> "Hello" ++ " " ++ "World"
"Hello World"
```

### 関数

```elm
add a b =
  a + b

add 1 3 -- => 4


-- ラムダ式
\n -> n + 1

(\n -> n + 1) 2  -- => 3

nums = [1,2,3]
List.map (\n -> n + 1) nums

-- |> オペレータ
names = ["hoge", "fuga", "piyo"]
names
  |> List.sort
  |> String.join ","
-- "fuga,hoge,piyo"
```

### if

```elm
x = 11
msg = if x > 10 then "OVER 10" else "NOT OVER 10"
msg
-- => OVER 10

if x == 100 then
    x + 1000
else if x == 10 then
    x + 100
else
    x
```

### case

```elm
fib n =
  case n of
    0 -> 1
    1 -> 1
    _ -> fib (n-1) (n-2)
```

## まとめ

基本的な文法とかをまとめました。
型の部分と、Elm Architectureの部分はまた別途記事にしようと思います。

個人的には、Elixir触っていた時期があったので `|>` オペレータでテンションがMAXになりました。(Haskellとかにもあるみたいですね)

シンタックスも馴染みやすいですし、アーキテクチャ等も面白そうなので引き続き触ってみたいと思います。

## 参考にしたサイト

* https://elm-lang.org/docs
* https://guide.elm-lang.org/
