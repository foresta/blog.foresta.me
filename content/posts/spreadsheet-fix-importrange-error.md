+++
title="スプレッドシートの IMPORTRANGE 関数のエラーを解消する"
date="2022-06-11T19:51:34+09:00"
categories = ["engineering"]
tags = ["spreadsheet"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Google スプレッドシートの関数である IMPORTRANGE 関数を使用したときに出たエラーとその解消方法についてまとめます。

## IMPORTRANGE 関数とエラー

IMPORTRANGE 関数は、別のスプレッドシートからデータを読み込むことができる関数になります。

以下のように使用します。

```
IMPORT(スプレッドシートのURL, 範囲)
```

- {{< exlink href="https://support.google.com/docs/answer/3093340?hl=ja" text="参考: IMPORTRAGE" >}}


とても便利な関数なのですが以下のようにエラーが出るケースがあります。

{{< figure src="/images/posts/spreadsheet-fix-importrange-error/error.png">}}

読み込むデータ量が多すぎるとエラーになるようです。

## QUERY 関数を用いて解決

上記のエラーは IMPORTRANGE 関数を複数回呼べば解決することができます。

```
=QUERY({
     QUERY(IMPORTRANGE(スプレッドシートURL,"A1:B10000"), "select *");
     QUERY(IMPORTRANGE(スプレッドシートURL,"A10001:B20000"), "select *")
 },
 "where Col1 is not null")
```

上記の例は、10000 行であれば読み込めることがわかっているときに、10000行ずつ読み込むような指定です。

QUERY 関数は SQL のようなクエリ言語 (Gogle Visualization API のクエリ言語) でスプレッドシートのデータを操作できるものです。
この関数の中に、さらに QUERY を書きセミコロンをつけて複数書くと各 QUERY の結果を縦に並べることができます。

これを用いて、読み込める範囲で少しずつ読むことができます。

## まとめ

今回は、スプレッドシートの IMPORTRANGE 関数でデータ量が多くてエラーになった際に、QUERY 関数を用いて解決する方法についてまとめました。

IMPORTRANGE 関数はスプレッドシートをまたがって集計したりデータを加工するのに向いているので使用するといろいろなことができるようになると思います。
ただ、データ量が多すぎるとエラーになることもあるため QUERY 関数で結合できることを覚えておくとよさそうです。


