+++
title="『A Philosophy of Software Design』を読んだ"
date="2024-10-06T20:51:33+09:00"
categories = ["engineering"]
tags = ["book", "design"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、名著と名高い『A Philosophy of Software Design』を読んで内容もとても良かったので、メモします。

## 書籍について

『{{< exlink href="https://www.amazon.co.jp/-/en/John-Ousterhout/dp/1732102201">}}』という本で、2018 年 に初版が発売され、2021 年に第2版が発売された歴史ある本です。

以下のような目次になっています。

```txt
Preface
1 Introduction
2 The Nature of Complexity
3 Working Code Isn’t Enough
4 Modules Should Be Deep
5 Information Hiding (and Leakage)
6 General-Purpose Modules are Deeper
7 Different Layer, Different Abstraction
8 Pull Complexity Downwards
9 Better Together Or Better Apart?
10 Define Errors Out Of Existence
11 Design it Twice
12 Why Write Comments? The Four Excuses
13 Comments Should Describe Things that Aren’t Obvious from the Code
14 Choosing Names
15 Write The Comments First
16 Modifying Existing Code
17 Consistency
18 Code Should be Obvious
19 Software Trends
20 Designing for Performance
21 Conclusion
Index
Summary of Design Principles
Summary of Red Flags
```


## 感想など

この書籍は、ソフトウェアシステムの複雑性とどのように戦っていくかという話が書かれていました。

そして複雑性の要因は、以下にあるとされています。

- 変更の増幅
  - ある実装をするのに変更する箇所が多い
- 認知的負荷
  - 依存関係など、タスクの完了までに必要な知識の両
- 未知の未知
  - タスク完了までに何をやらねばいけないのかが不明瞭
  - 考慮するべき点がわからず、バグが出るまで記すべがない


この書籍では抽象化と情報の隠蔽の重要さが非常に多く語られていました。

例えば、4 章では、深い Module の設計するという話があります。
細かく、小さくクラスなどを設計するという話はいろいろなところで聞きますが、深いインターフェースを設計するという話はここで初めて聞きました。


ここでいう深いとは、多くの情報を隠蔽できるように設計するということでした。
以下に多くの情報を隠蔽するかという観点で設計するのはとても有用そうに思いました。
また、深いインターフェースにするために、汎用化したインターフェースを持つという点もとても重要そうに思いました。
そして、インターフェースの汎用的なものと特殊なものでレイヤーを分けていくような話もとてもわかり易かったです。


設計のときに、非常に役立ちますしまたコードレビューの際にもとても役立ちそうなのでチームで読んだりすると良さそうだなと思ったりしました。

今後自分がコードを書いていくときの指針としたい一冊でした。
