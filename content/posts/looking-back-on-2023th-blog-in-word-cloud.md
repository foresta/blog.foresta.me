+++
title="word cloud で 2023 年のブログを振り返る"
date="2023-12-31T15:26:25+09:00"
categories = ["engineering"]
tags = ["blog", "word_cloud"]
thumbnail = "/posts/looking-back-on-2023th-blog-in-word-cloud/wordcloud.png"
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

早いもので、2023 年も終わりが近づいてきました。

今年も無事に週一でブログを書き続けることができました。2018 年から書き始めていて 5 年近くですが続けられてよかったです。

今年も毎年恒例の WordCloud などでブログを振り返ります。

## 今年の成果

今年書いた記事数は以下の通りです。

```bash
$ grep 2023 -rl ~/work/blog.foresta.me/content/posts/ | wc -l
      55
```

今年は Advent Calendar も 2 記事書くことができました。

- {{< exlink href="https://qiita.com/advent-calendar/2023/datatech-jp" text="datatech-jp Advent Calendar 2023">}} 10 日目
- {{< exlink href="https://qiita.com/advent-calendar/2023/alumni" text="検索エンジンプロダクトを一緒に開発してた同窓会 Advent Calendar 2023" >}} 17 日目

## WordCloud

手法は過去の記事と同様です。

- [word cloud で今年のブログを振り返る](/posts/looking_back_on_2019th_blog_in_word_cloud)


今年は以下のようになりました。

{{< figure src="/images/posts/looking-back-on-2023th-blog-in-word-cloud/wordcloud.png" >}}

一番目立つのは、データというものです。

これはもちろん汎用的な単語なこともあるのですが、今年 10 月からデータエンジニアとして働き始めたこともあると思います。
データマネジメントなどもよく見える位置にあります。

現在データ基盤周りの開発をしているのでこの辺りは来年も引き続きキャッチアップしていきたいです。

また、オブザーバビリティや Platform Engineering まわりも興味関心が出てきた年でした。
この辺りは、データエンジニア以前に興味があったのですがデータ基盤を Product として提供する、Platform as a Product という考え方に興味があり、キャッチアップを始めていました。来年も取り組んでいきたいです。

他に目立つものとしては、圏論まわりです。
2023 年の始めごろにまとめて圏論について書いていました。

- [圏論への入門 圏論とは](/posts/learn-category-theory-01/)
- [圏論への入門 圏の例としての順序集合](/posts/learn-category-theory-02/)
- [圏論への入門 集合圏 Set](/posts/learn-category-theory-03/)
- [圏論への入門 モノイドとモノイドの圏](/posts/learn-category-theory-04/)
- [圏論への入門 関手とは](/posts/learn-category-theory-05/)
- [圏論への入門 Hom 関手について](/posts/learn-category-theory-06/)
- [圏論への入門 自然変換](/posts/learn-category-theory-07/)

このあたりも中途半端になっているので、隙を見つけて学んでいきたいなと思っています。

## 来年の目標について

来年も引き続きブログを続けていきたいと思います。やはり週一を目標に年間 52 記事くらいかけたら良いなと思います。

また、来年は記事の質にももうちょっとこだわりたいなと思いました。続けることが大事なのはそうですが少しでも質がよく、読みやすくという点にこだわりたいです。

また、やってみた系の記事が多く、ブログの最後に「今後も触っていきたいと思います」とか書きつつ触れてない技術とかあるのでその辺りの続編や、そもそももう少し独自に調査や開発をした結果みたいなものをアウトプットするようにしていきたいです。

## さいごに

今年もブログを wordcloud で振り返ってみました。
1 年無事に書き続けることができてよかったです。来年もがんばります！

みなさま、良いお年を。
