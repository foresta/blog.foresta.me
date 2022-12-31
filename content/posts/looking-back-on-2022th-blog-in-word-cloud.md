+++
title="word cloud で 2022 年のブログを振り返る"
date="2022-12-31T13:54:20+09:00"
categories = ["engineering"]
tags = ["blog", "word_cloud"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

2022年も年の瀬になりました。

今年も一年間週一でブログを書き続けることができ、この記事を入れて合計で52記事を書くことができました。

そこそこ書けたので毎年恒例の word cloud で振り返ってみます。

## word cloud

手法は過去の記事と同様です。

- [word cloud で今年のブログを振り返る](/posts/looking_back_on_2019th_blog_in_word_cloud)


今年は以下のような結果になりました。

{{< figure src="/images/posts/looking-back-on-2022th-blog-in-word-cloud/wordcloud.png">}}


今年は、`Scala` が多かったように思います。また Windows PC を購入していろいろな環境構築をしたので、`インストール` などの単語も含まれていそうです。

今年書いた [scala タグ](/tags/scala) がついている記事は以下のとおりです。

- [Scala の並列コレクションで処理を高速化する](/posts/scala-parallel-collections/)
- [scala-uri で角括弧を含む文字列が Parse Failed する件の調査ログ](/posts/scala-uri-parse-failed/)
- [scala-redis を使ってみる](/posts/intro-scala-redis/)
- [Scala で Duck Typing を使ってコードを共通化する](/posts/scala-duck-typing/)
- [Scala の 型パラメータによる抽象化](/posts/scala-type-parameter/)
- [Scala で shapeless を使ってみる](/posts/using-shapeless-for-generic-programming/)
- [Scala で List から Mapに変換する](/posts/scala-list-to-map/)
- [Scala で既存の型を拡張する](/posts/scala-extension-method/)
- [WSL 上にScala の環境を構築する](/posts/scala-in-wsl/)
- [Scala の Regex で全角半角を無視して match する方法](/posts/scala-regex/)
- [Scala で case class をソートする](/posts/scala-case-class-sorted/)
- [Scala から Parameter Store のデータにアクセスする](/posts/ssm-parameter-for-scala/)
- [Scala で Retry 処理を実装する](/posts/scala-retry/)
- [Mockito でメソッドの呼び出し回数のテストをする](/posts/mockito-test/)

14記事書いていたみたいです。
去年は入門記事だったのに対し、今年は実際に開発してみて躓いたところやライブラリについてなどより一歩深いところの記事がかけたんじゃないかなと思います。

特に以下の記事あたりでは、Scala の implicit 周りの理解がより一層深まって Scala の表現力の高さを知ることができたと思います。
- [Scala で Duck Typing を使ってコードを共通化する](/posts/scala-duck-typing/)
- [Scala の 型パラメータによる抽象化](/posts/scala-type-parameter/)
- [Scala で shapeless を使ってみる](/posts/using-shapeless-for-generic-programming/)


業務で Scala を書く機会も増え、去年よりも多くの知見を得ることができました。
来年もおそらく Scala を書いていくと思います。

## まとめ

2022 年のブログを word cloud で振り返ってみました。

去年転職し今年で 1 年たちましたが、こうして Output を振り返ってみると Scala を多く書いてきたなぁとあらためて実感できます。
学んだことをちゃんと Output できて良かったと思います。

今年は趣味開発っぽい記事が少なく、業務で使用している技術によっているのも振り返って感じました。業務上の input も行いつつ、来年はもう少し自分の気になっている技術などについても色々 Input & Output していきたいと思います。

ブログを word cloud で振り返るの毎年恒例になってますが、来年も続けていきたいと思いました。

それでは、良いお年を。

