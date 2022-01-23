+++
title = "Hugoで関連する記事を表示する"
thumbnail = ""
tags = ["hugo", "blog"]
categories = ["engineering"]
date = "2019-12-01"
+++

こんにちは、[@kz_morita](https://twitter.com/kz_morita)です。\
ブログを１年近く続けてきて、おかげさまで月間の PV が 2000 くらいになるまで皆さんに読んでいただけるまでになりました。
Google Analytics をみていると、直帰率 87.26%となかなか高かったのでここを改善するために、ブログ記事に関連する記事を表示してみました。

{{< figure src="/images/posts/related_articles_with_hugo/google_analytics.png" caption="GAの画面。ページ滞在時間とかなかなか良さそう？" >}}

結論からいうと Hugo で非常に簡単に追加することができましたので、Hugo を使ってる方はぜひ入れてみてください。

なお今回の Hugo のバージョンは以下になります。

```bash
$ hugo version
Hugo Static Site Generator v0.59.1/extended darwin/amd64 BuildDate: unknown
```

## 関連記事の追加

今回は記事ページに関連記事を追加するので、`layouts/_default/single.html` に追記します。\
自分のサイトの例を下記に載せます。

##### layouts/\_default/single.html

```html
{{ $related := .Site.RegularPages.Related . }} {{ with $related }}
<div class="container l-related-articles">
  <h2 class="l-list-title">関連記事</h2>
  <ul class="l-box-wrap container col3">
    {{ range . }}
    <li class="l-box">{{ partial "_list-item.html" . }}</li>
    {{ end }}
  </ul>
</div>
{{ end }}
```

重要な部分は以下の部分です。

```html
{{ $related := .Site.RegularPages.Related . }}
```

この記述だけで、現在表示している記事の関連記事を取得できるようです。非常に便利ですね。
内部のロジックは正確に把握していないのですが、おそらくタグなどをみて関連づけているようです。(ドキュメントに書いてあるかもですが...)

ちなみにこの機能は Hugo の 0.27 以上で導入されたようです。\
詳しくはこちらから https://gohugo.io/news/0.27-relnotes/

### レイアウト

```html
<ul class="l-box-wrap container col3">
  {{ range . }}
  <li class="l-box">{{ partial "_list-item.html" . }}</li>
  {{ end }}
</ul>
```

レイアウトの部分に関しては上記の記述だけで良い感じに表示することができました。\
CSS を割とちゃんと設計したのと、Hugo の partial でリストアイテムをコンポーネント化してたのでとても簡単でした。\
こういったコンポーネント化が簡単なのも Hugo の良いところですね。

## まとめ

今回は Hugo で関連記事を出す方法について簡単に紹介しました。\
これでこの記事の下にも関連記事が表示されているはずです。
今回の作業で関連記事の追加自体は非常に簡単にできたのですが、Hugo のバージョンアップに多少てこずりました。
バージョン`0.18.x`から `0.59.1` に一気にあげたため色々変わっていて大変でした。

こまめなアップデートは必須ですね。

{{< tweet user="kz_morita" id="1199666550157897728" >}}

若干てこずりましたが無事関連記事が追加できたので、直帰率がどのように変化するのか見守ってみたいと思います。
