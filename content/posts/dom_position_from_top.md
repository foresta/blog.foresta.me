+++
title = "HTML/JavaScriptでページ最上部からの位置を取得する方法"
thumbnail = ""
tags = ["html", "javascript", "css"]
categories = ["engineering"]
date = "2019-07-28"
+++

こんにちは、[kz_morita](https://twitter.com/kz_morita)です。\
最近はVue.js / Nuxt.js あたりで Web フロントを書いたりしています。

今回は、ページの最上部からある特定のDOMの位置座標を取得するのにちょっとつまづいたため、そのことについてまとめておきます。

## 試した方法

以下の二種類の方法を試しました。

- HTMLElement.offsetTop
- Element.getBoundingClientRect().top + window.pageYOffset


結論から言うと、ページの最上部からの位置を取得する仕様は２つ目の方法で実現することができました。

## HTMLElement.offetTop

HTMLElement.offsetTopの仕様は以下のサイトに詳しく書いています。

https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/offsetTop

それでは、offsetTopを使ってページ上部からの位置座標を取得してみます。

以下のコードは各DOMの位置を `offsetTop` から取得して、各DOMの innerText として表示している例です。

<script async src="//jsfiddle.net/kz_morita/pactm5de/45/embed/"></script>

- dom1が一番上に配置されているので0
- dom2-1は dom1の高さ + dom1,dom2間のmargin + dom2のpadding = 120 + 10 + 10 = 140

となっており、期待通りに正しく動いているように見えます。

### offsetTopの問題点

offetTopを取得したい要素の親要素に、 `position: relative` が指定されていると画面上部からのOffsetを取ることができません。

以下は、 `#dom2 { position: relative; }` を指定した場合のソースコードです。

<script async src="//jsfiddle.net/kz_morita/pactm5de/50/embed/"></script>

`dom2-1`, `dom2-2`, `dom2-3` の `offsetTop` が親要素である `dom2` からの位置座標になっていることが分かります。

これはdom2に `position: relative` を指定することで、dom2-1, dom2-2, dom2-3 の offsetParentがdom2になるためです。

https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/offsetTop

上記サイトに記載されている通り、HTMLElement.offsetTop は [offsetParent](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/offsetParent) からの相対距離を取得するプロパティとなります。

positionを指定しないときは、ofsetParentが body になるため、ページ上部からの座標をとることができていたというわけです。

position: relative が指定され血ても当初に仕様を満たすためには、次に説明する方法を使用します。

## Element.getBoundingClientRect().top + window.pageYOffset

上記は、

- Element.getBoundingClientRect()
= window.pageYOffset

から成り立っているためそれぞれ別々に説明します。

### Element.getBoundingClientRect()

Element.getBoundingClientRectの仕様はいかに記載されています。

https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect


getBoundingClientRectでは画面の左上から、描画しているDOMの矩形の情報を取得することができます。
そのため、 `getBoundingClientRect().top` とすることにより座標を取得することができます。

しかし、この `getBoundingClientRect()` はHTML文書の左上でなく、 `画面の左上` からの位置情報になります。つまり、画面をスクロールすると値が変わってしまいます。

スクロールして上の方に来れば、 `getBoundingClientRect().top` の値は小さくなっていきます。

そのため、スクロール量を考慮しなければいけません。

### window.pageYOffset

仕様はいかに記載されています。

https://developer.mozilla.org/ja/docs/Web/API/Window/pageYOffset

window.pageYOffsetを使用することによって、現在のスクロール量を取得することができます。

ちなみに、 `widnow.pageYOffset` は `window.scrollY` のエイリアスのためどちらを使っても良いらしいです。
(参考: https://developer.mozilla.org/ja/docs/Web/API/Window/scrollY#Notes)

---

前述の `getBoundingClientRect().top` と組み合わせて、 `getBoundingClientRect().top + window.pageYOffset` とすることで、HTML文書の左上からの座標を取得することが可能になります。

以下ソースコードです。

<script async src="//jsfiddle.net/kz_morita/pactm5de/68/embed/"></script>

## まとめ

ページ上部からの位置座標を取得したい時には、 `dom.getBoundingClientRect().top + window.pageYOffset` を使用すれば良いことをまとめました。

これを利用すれば、ユーザーのスクロール量などと比較して色々な演出ができるかと思います。\
HTMLは意外と奥が深くてまだまだ知らないことが多そうなので、都度まとめていこうと思います。

