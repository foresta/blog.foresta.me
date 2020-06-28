+++
title="Macbook pro, Thinkpad P43s の給電用にモバイルバッテリーを購入した"
date="2020-06-28T19:57:38+09:00"
categories = ["engineering"]
tags = ["pc", "battery", "gadget"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，普段使用している Macbook pro と，Thinkpad P43s を外でも給電しながら使いたかったので，モバイルバッテリーと周辺装置を購入しましたので，実際に購入したガジェットとその際に調べたことなどをまとめていきます．

結論から言うと，購入したもので問題なく充電をすることができました．

## 購入したもの

以下の 3 つを購入しました．

### モバイルバッテリー

<a href="https://www.amazon.co.jp/gp/product/B07YKHL7W2/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=foresta04-22&linkId=84e8afa6a42bc0cfb2dd016a4886badb&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07YKHL7W2&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B07YKHL7W2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/31l6ssR" text="HyperJuice 27000mAh USB-C モバイルバッテリー Silver" >}}

最大出力が，100W で圧倒的でした．ただ本体重量は 650g で手で持った感じもかなり重たいです．

### 充電器

<a href="https://www.amazon.co.jp/gp/product/B07FSM5LKW/ref=as_li_ss_il?ie=UTF8&psc=1&linkCode=li2&tag=foresta04-22&linkId=684dfe1788168198dcd012790040b768&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07FSM5LKW&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B07FSM5LKW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/38awCj7" text="Hyppr PD 充電器 100W Type C 急速充電器" >}}

モバイルバッテリーを充電するためにも高出力の充電器が必要なためこちらを買いました．こちらも 100W で出力するこたおができます (20V 5A)．通常の充電器でも充電できるのですが，この充電器であれば一時間ほどでフル充電できるというスピードに惹かれて購入しました．

### Type-C ケーブル

<a href="https://www.amazon.co.jp/gp/product/B0827KJ6DY/ref=as_li_ss_il?ie=UTF8&psc=1&linkCode=li2&tag=foresta04-22&linkId=e5e3f00d074aad2bf24437fe45b46969&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0827KJ6DY&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B0827KJ6DY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/2BIM7D5" text="RAMPOW Type C-Type C ケーブル" >}}


個人的に大好きなメーカーなのですが，上記2つは，3.25A と 5A で高い電流をながすためケーブルもそれに対応するものを購入する必要があったので購入しました．

## 調べたりしたこと

まず，モバイルバッテリーを買う上で一番注意したのが，出力のW数です．

Thinkpad P43s は {{< exlink href="https://www.lenovo.com/jp/ja/static/catalog/nb-2019-p43s_cs_0730" text="製品仕様書">}} を見ると，最大消費電力が 65W で, 実際にThinkpad P43s のACアダプターには，以下のように表記されていました．

```
20V 3.25A / 15V 3A / 9V 2A / 5V 2A
```

最大で，$20 (V) * 3.25 (A) = 65(W)$ なので，65 W の出力ができそうなモバイルバッテリーが適していそうです．

また，Macbook pro 13 インチはの電源には，以下のように表記してありました．

```
20.3V 3A (USB PD) / or 9V 3A (USB PD) or 5.2V 2.4A
```

こちらも最大で，$20.3 (V) * 3 (A) = 60.9(W)$ となっていそうでした．

この条件で探していくことになるのですが，最大出力 65 W に対応したモバイルバッテリーはなかなか見つかりませんでした．
今回買ったモバイルバッテリーの他に最大出力 65W で検索して見つかったのは以下のようなモバイルバッテリーたちでした．

--- 
<a href="https://www.amazon.co.jp/AUKEY-%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E3%83%90%E3%83%83%E3%83%86%E3%83%AA%E3%83%BCPC%E5%B0%82%E7%94%A8-26800mAh-Delivery-3A%E6%80%A5%E9%80%9F%E5%85%85%E9%9B%BB%E5%AF%BE%E5%BF%9C/dp/B086B8W5BF/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=foresta04-22&linkId=64f555ba8426039d7480cfc1fb643060&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B086B8W5BF&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B086B8W5BF" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/2YG09OQ" text="AUKEY モバイルバッテリーPC専用 超大容量 26800mAh" >}}


こちらは，最有力候補でしたが，Thinkpad の方の最大が，`20V 3.25A` でこちらの製品が `3A 急速充電対応` と書かれていたため，3.25A に対応できるかわからなかったため見送りました．

---

<a href="https://www.amazon.co.jp/%E3%82%B5%E3%83%B3%E3%83%AF%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88-%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E3%83%90%E3%83%83%E3%83%86%E3%83%AA%E3%83%BC-22800mAh-%E3%83%8E%E3%83%BC%E3%83%88%E3%83%91%E3%82%BD%E3%82%B3%E3%83%B3%E5%AF%BE%E5%BF%9C-700-BTL035/dp/B07K1XQXC4/ref=as_li_ss_il?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&dchild=1&keywords=%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E3%83%90%E3%83%83%E3%83%86%E3%83%AA%E3%83%BC+65W&qid=1593350344&sr=8-10&linkCode=li2&tag=foresta04-22&linkId=3b1cc806358f91104c8804c5281ec485&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07K1XQXC4&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B07K1XQXC4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/3dFWfcX" text="サンワダイレクト AC出力対応 モバイルバッテリー 大容量 65W 22800mAh" >}}

こちらは，65W 出力という文言に惹かれましたが，AC 出力 (コンセント的なやつ) だったので，今回のユースケースには合致しませんでした．

---

<a href="https://www.amazon.co.jp/air%E3%83%90%E3%83%83%E3%83%86%E3%83%AA%E3%83%BC-MAXOAK-%E5%85%85%E9%9B%BB%E7%94%A8%E3%82%B1%E3%83%BC%E3%83%96%E3%83%AB%E4%BB%98%E3%81%8D-TYPE-C%E5%AF%BE%E5%BF%9C%E3%81%AE%E3%83%8E%E3%83%BC%E3%83%88PC-%E3%82%A2%E3%82%A6%E3%83%88%E3%83%89%E3%82%A2%E3%81%AB%E5%A4%A7%E6%B4%BB%E8%BA%8D/dp/B01DNBPV9C/ref=as_li_ss_il?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&dchild=1&keywords=%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%E3%83%90%E3%83%83%E3%83%86%E3%83%AA%E3%83%BC+65W&qid=1593350344&sr=8-17&linkCode=li2&tag=foresta04-22&linkId=2b098d473d39f0173f526529e5080549&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01DNBPV9C&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B01DNBPV9C" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://amzn.to/3g6XIui" text="Macbook airバッテリー MAXOAK 36000mAh 大容量 87w 133Wh PD対応">}}


こちらも，87W 出力と表記されていますが，おそらくDC出力だと思います．Ankerから USB Type-C と DC の変換ケーブルが発売されているみたいでしが，日本ではまだ発売されてなさそうなこともあり今回は見送りました．

{{< exlink href="https://www.anker.com/products/variant/powerline-usbc-to-dc-cable/A2660011" text="PowerLine USB-C to DC Cable" >}}

---

## まとめ

今回は，購入したモバイルバッテリーの紹介と，その際に調べたことについて軽くまとめました．

購入した機器にも満足していて，純正の充電器の代わりとして統一して扱えそうでとてもよいです．（が，やはり純正のを使うのが機器的には一番良いのだろうなとも思っています)

また，AC / DC 変換や，V (ボルト), A (アンペア), W (ワット) など物理で習ったようなことを復習しているようで調べていて楽しかったです．
