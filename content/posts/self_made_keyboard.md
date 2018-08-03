+++
date = "2018-08-02T13:02:25+09:00"
title = "Planckキーボードを作ってみた"

categories = ["enginnering"]
tags = ["keyboard"]
thumbnail = "/posts/thumbnails/keyboard.jpg"

+++

以前から興味があった自作キーボードですが、Planckキーボードを作って見たのでそのログです。

日課であるmassdropチェックをしていたら、planckキーボードの共同購入が始まってることを知り、その場の勢いでポチったのがことの始まりでした。
Planckキーボードは世界最小とも言われているらしく、40%キーボードで格子配列なのが特徴的ですね！

Planckキーボードの詳細についてはこちらで
https://www.massdrop.com/buy/planck-mechanical-keyboard

## 購入

上記のとおり、[Massdrop](https://www.massdrop.com/)で共同購入しました。\
2/8に共同購入にjoinし、自宅に届いたのが7月の中旬なのでおよそ5ヵ月くらいかかりました。\
まだかなまだかなーと待ち続けてましたがはまぁここらへんはしょうがないでしょう。

あと、工具系も全然なかったので合わせて購入しました。

{{< figure src="/images/posts/self_made_keyboard/tools.jpg" >}}

以下のものをAmazonでポチり。

<a href="https://www.amazon.co.jp/gp/product/B002L6HJ9Q/ref=as_li_ss_il?ie=UTF8&psc=1&linkCode=li2&tag=foresta04-22&linkId=9f925d098550c35fc3ec8d2d2108134b" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B002L6HJ9Q&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&l=li2&o=9&a=B002L6HJ9Q" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> \
<a href="https://amzn.to/2ODnoli" target="_blank">エンジニア 卓上導電マット A3サイズ 320×450×2mm ZCM-06</a>

<a href="https://www.amazon.co.jp/gp/product/B017SQ0TUO/ref=as_li_ss_il?ie=UTF8&psc=1&linkCode=li2&tag=foresta04-22&linkId=927189b16a3e83f10473691cf818fba7" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B017SQ0TUO&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&l=li2&o=9&a=B017SQ0TUO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> \
<a href="https://amzn.to/2ADcJUW" target="_blank">白光(HAKKO) セラミックヒーターはんだこて専用こて台 クリーニングスポンジ付き FH300-81</a>

<a href="https://www.amazon.co.jp/gp/product/B076KMS5CV/ref=as_li_ss_il?ie=UTF8&psc=1&linkCode=li2&tag=foresta04-22&linkId=322d6725c5446fd46fbb37ad4d7b4fea" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B076KMS5CV&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&l=li2&o=9&a=B076KMS5CV" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> \
<a href="https://amzn.to/2AMwREn" target="_blank">白光 ダイヤル式温度制御はんだこて 基盤が見える クリアタイプ FX600A No.Y163</a>


<a href="https://www.amazon.co.jp/gp/product/B0029LGAKW/ref=as_li_ss_il?ie=UTF8&psc=1&linkCode=li2&tag=foresta04-22&linkId=b31f1f0979876f9acc77bdf4afe76b56" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0029LGAKW&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&l=li2&o=9&a=B0029LGAKW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> \
<a href="https://amzn.to/2KnGetj" target="_blank">goot 両面プリント基板用はんだ SD-61</a>


<a href="https://www.amazon.co.jp/gp/product/B001D7JEIS/ref=as_li_ss_il?ie=UTF8&psc=1&linkCode=li2&tag=foresta04-22&linkId=138b8277039b6bb0ff1945a0017ff29e" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B001D7JEIS&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&l=li2&o=9&a=B001D7JEIS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> \
<a href="https://amzn.to/2KjOQRW" target="_blank">goot はんだ吸取り線 CP-20Y</a>



## 組み立て

自作キーボード自体が初めてだし、はんだ付けも中学校以来やってなかったのでかなり慎重にググりながらやってました。

すごく参考になったのは以下のサイト様です。非常に助かりました。

* http://okapies.hateblo.jp/entry/2017/03/26/063136


### 準備

すべてのパーツが出揃って作っていく気持ちを高めます。

{{< tweet 1018766948786585600 >}}

### 基盤の動作確認

念のために動作確認を行いました。
PC(Macbook)にUSBで基盤をさすと、LEDとビープ音が反応し無事に認識しました。

### キースイッチをプレートと基盤にはめ込む 

キースイッチをプレートにパチパチはめていきます。\
プレートの後ろに基盤をあてて、スイッチの足が基盤の穴からでるように無心ではめ込んでいきます。
キースイッチは向きがありそうなので注意。

完成するとこんな感じ。


{{< figure src="/images/posts/self_made_keyboard/switch.jpg" >}}

### はんだ付け

お待ちかねのはんだ付け。
はんだごての温度はだいたい350℃ほどにしました。\
無我夢中ではんだ付けをしていきます。
これは、楽しい。

不慣れなため、1時間ほどかかりましたが夢中ではんだ付けしてました。
心を無にできて良い。

{{< tweet 1018785869925310465 >}}




完成するとこんな感じ。

{{< figure src="/images/posts/self_made_keyboard/making.jpg" >}}

この状態ですでに動くはずです。
スイッチを隅々押していって反応してるかチェックしていきます。
無事に全てのキーが動いてそうでした。

{{< tweet 1018790913525493760 >}}

### ケースの組み立て

あとはこのスイッチたちをケースに入れて、ねじ止めして完成。

のはずだったのですが、ここで事件が発生しました。\
付属していたネジが短すぎてケースに基盤がとまらないという現象が。
ここで2,3時間格闘しましたが全く止まる気配がなく、あきらめてネジを購入することに。

{{< tweet 1018823687384907777 >}}

M2の皿小ネジのセットを購入しました。\
付属していたネジの長さがどうやら5mmで、実際には6mmのネジじゃないと止まりませんでした。\
これは罠。

<a href="https://www.amazon.co.jp/gp/product/B079Z8L15V/ref=as_li_ss_il?ie=UTF8&psc=1&linkCode=li2&tag=foresta04-22&linkId=e644f8ea7717e65c991c87a9b422995f" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B079Z8L15V&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&l=li2&o=9&a=B079Z8L15V" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> \
<a href="https://amzn.to/2Ayu2Gw" target="_blank">【M2x4‐M2x8】ステンレス 皿頭 小ねじセット</a>

### 完成

途中ネジがとまらないなどのトラブルがありましたがどうにか完成することができました。\
指に通常のキー配列の動きが染み付いているのか、なかなか格子配列に苦戦していて
完成してから2週間ほど経ちましたが未だなれずにいます。徐々に慣らしていこうと思います。

軽く触って見た感想としては、手が本当にホームポジションから動くことがなくこれは使いこなしたらかなり楽そうというものでした。

あとは、キーマップの書き換えなどをしてさらにカスタマイズしていきたいですね。

## まとめ

自作キーボード入門としてPlanckキーボードを作ってみました。
純粋に作るのが非常に楽しかったです。

キーボード自作も電子工作も初心者でしたが、無事つくりきることができたので自作キーボードを始めてみたいという方の入門編としてはよさそうでしたのでおすすめです。

自作キーボード興味あるけどできるか不安という方はこのPlanckキーボードを検討して見てはいかがでしょうか。

