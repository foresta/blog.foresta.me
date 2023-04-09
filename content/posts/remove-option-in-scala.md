+++
title="Scala で Option を外す方法"
date="2023-04-09T14:58:31+09:00"
categories = ["engineering"]
tags = ["scala"]
thumbnail = ""
+++

Scala の Option 型とその外し方についてのメモです．

以下のような Option 型からデータの取り出し方と値があるときのみ処理する方法についてまとめます．

```scala
val someText: Option[String] = Some("hoge")
val noneText: Option[String] = None
```

## 値を取り出す

Option 型から値を取り出すときの書き方です．

-   match
-   map / getOrElse
-   isDefined, nonEmpty, isEmpty

個人的には，match と map / getOrelse を良く使用します．

### match

match を使うと，Some と None の場合に応じて処理が分けられます．
直感的で読みやすい．

```scala
def remove1(text: Option[String]): String = {
  text match {
    case Some(t) => s"text = ${t}"
    case None => "text is None"
  }
}
```

### map, getOrElse

map などの関数を使用する方法です．
map で値があるときの処理を，getOrElse で値がないときのデフォルト値を処理を書くことが出来ます．

```scala
def remove3(text: Option[String]): String = {
  text.map(t => s"text = ${t}").getOrElse("text is None")
}
```

### isDefined, nonEmpty, isEmpty

Option 型には上記のような型が用意されているのでこれらを使って if 式で判定するほうほうです．
値を取り出すのには，get メソッドを使用します．

```scala
def remove2(text: Option[String]): String = {
  if (text.isDefined) { // text.nonEmpty or !text.isEmpty
    s"text = ${text.get}"
  } else {
   	"text is None"
  }
}
```

値がない場合に，get メソッドを呼ぶと以下の様な Exception がスローされます．

```
Caused by: java.util.NoSuchElementException: None.get
```

## 値があるときのみ処理する

値があるときのみ処理したい場合の書き方です．

-   foreach
-   for ~ yield 式

Future などでも同様に使える構文なので Option 型に限らず使用頻度が高いです．

### foreatch

foreach メソッドの引数に処理を渡すと値があるときのみ処理が行われます．

```scala
def remove4(text: Option[String]) = {
    text.foreach(t => println(s"text = ${t}"))
}
```

直感的にわかりにくいかもですが，

-   Some => List の値がある
-   None を List の Nil (値がない)

と考えると値がないときは実行されないイメージがつきやすいと思います．

### for ~ yield 式

for ~ yield 式で Option がある場合の処理を書くことが出来ます．

```scala
def remove5(text: Option[String]) = {
    for {
        t <- text
    } yield println(s"text = ${t}")
}
```

## まとめ

今回は，Scala で Option を外す方法について簡単にまとめました．

Scala に入門して最初に躓くのがこのあたりの map, for 式, foreach あたりの文脈をもった値かなと思っています．
逆にこのあたりを理解すると，Scala 楽しいってなるんじゃないかなと思ったりしました．
