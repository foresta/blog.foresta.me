+++
title = "ちょっとおしゃれなhoverアニメーションを作る"
thumbnail = ""
tags = ["css", "html"]
categories = ["engineering"]
date = "2019-04-20"
+++

こんにちは、[@kz\_morita](https://twitter.com/kz_morita)です。\
普段はiOSエンジニアとしてSwiftを書いていて、Swiftはだいたい半年くらいさわっています。
それ以前は、C# でサーバーサイド書いていたり、C++/Cocos2d-xでゲーム開発をしていたりしました。

このブログはレイアウトやデザインを一から実装しているのですが、その中でもリンクをhoverした時のアニメーションをこだわって作ったので今回はその話をしていこうと思います。

おもにCSSアニメーションの話になるかと思いますので興味がある方はぜひこの記事を読んで気軽に試してみてもらえたら嬉しいです。

## 作るもの

{{< exlink href="https://google.com" >}}

↑ のリンクにhoverしてみてください。
ふわっとアンダーラインがアニメーションで表示されたかと思います。

GIFだとこんな感じ。
{{< figure src="/images/posts/impl_link_hover_animation/link-hover-animation.gif" >}}

今回はこれを作っていきます。

## 成果物

いきなり成果物ですが簡単に実装したものをJSFiddleで公開しましたので参考にしてください。

<script async src="//jsfiddle.net/kz_morita/t26a9z8w/embed/html,css,result/dark/"></script>

以下実装の解説的なものをしていきます。

## aタグを準備

まずはaタグを準備します。

```html
<a href="https://google.com" class="link-hover">Google</a>
```

のちのち、CSSを当てるためのクラスを `link-hover` として当てています。

## aタグはinline-blockにする 

まずはaタグに基本となるスタイルを当てていきます。

下のようなCSSを当てます。
(必要最低限のCSSのみを載せています)

```css
.link-hover {
  text-decoration: none;
  display: inline-block;
}
```

今回アニメーションで表示する下線ですが、
アニメーションさせる関係上、デフォルトの下線ではなくafter擬似要素を利用します。
そのため、`text-decoration: none` を設定します。

また、`inline-block` にしないと下線の範囲が正しく設定できないためこちらも必須です。

## after擬似要素で下線を再現

以下のCSSでafter擬似要素のスタイリングをします。\
線の高さなどを指定していきます。

```css
.link-hover::after {
  display: block;
  content: "";
  height: 2px;
}
```

## CSSアニメーション

最後にCSSアニメーションを書いていきます。
今回は横方向に伸縮させるため、widthをアニメーションさせます。
hover前は `width: 0%` を指定し、hover後は `width: 100%`を指定します。

そして、CSSアニメーションの `transition` プロパティでwidthを指定してあげればOKです。
`transition {target} {duration} {easing}` という形で、秒数やイージングも指定できるのでお好みで指定するといろいろ試せるかと思います。

```css
.link-hover::after {
    width: 0%;
    transition: width 0.5s ease;
}

.link-hover:hover::after {
    width: 100%;
    transition: width 0.5s ease;
}
```

## まとめ

CSSアニメーションするLinkの実装について簡単に紹介しました。\
簡単に実装できるわりには実際にアニメーションすると気持ち良かったりするので、こういった細かいところにもこだわっていくと実装楽しいですね。

自分でブログなどのサイトを作っているとこのように色々遊べて楽しいのでおすすめです。
