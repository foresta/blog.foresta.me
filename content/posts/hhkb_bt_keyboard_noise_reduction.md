+++
categories = ["engineering"]
date = "2019-04-07"
title = "HHKB BTを静音化してみた"
thumbnail = "/posts/hhkb_bt_keyboard_noise_reduction/thumbnail.jpg"
tags = ["keyboard"]
+++

## はじめに

この記事はHHKB BTの静音化が無事に完了し、ほっと息をなでおろしながら書いています。
当然、静音化されたHHKB BTで書いているのですが、最高に気持ち良いです。\
タイピングしている感触でいうと、HHKBのType-Sにかなり近いです。

3万もする高級キーボードを改造するので多少のリスクはありますが今回静音化して正解でした。
Type-Sの感触が好きな方は、静音化にチャレンジしてみると良いのではないでしょうか？

(リスクがあるし保証も効かなくなるので、あくまで自己責任でお願いします)

## 静音化のきっかけ

職場や家でも普段からHHKB BTを使用していて、特に不満はなかったのですがある日、会社の集中席で仕事をしているときに、やたら自分の叩くキーボードの音が気になりました。\
もしかしたら周りの人も気になってるかも？と思い始めるとなんだか気が散ってしまい、集中席で集中できないというよくわからない現象に陥ってしまいました。

このままではいけない、とそう決意した私は、HHKB BT の静音化 (Type-S化) に取り組むのでした。

まぁきっかけは集中席でしたが、前々からType-Sのタイピング感とか「スコスコ」っていう音がすごい好きだったので、良いタイミングだなーと思いチャレンジしてみました。

## 作業準備

「HHKB BT 静音化」などでググってみるといくつかの記事がヒットしたのですが、O-Ringと呼ばれるメカニカルキーボードの静音化用のゴムが売られているみたいだったのでそれを購入しました。

<a href="https://www.amazon.co.jp/gp/product/B01H6Q53UC/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=foresta04-22&linkId=b1dee96f51d4e7cd0e6d9098bf326dc6&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01H6Q53UC&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B01H6Q53UC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> \
{{< exlink src="https://amzn.to/2FZoW5X" text="Hapurs メカニカル キーボード Cherry MX軸対応 ゴム 静音化リング O-Ring" >}}

上記は、Cherry-MX用と書かれていましたが、HHKB BTでも問題なく使用することができました。


そのほかにキーキャップを外すので以下のような器具があるとよさそうです。

<a href="https://www.amazon.co.jp/dp/B00HC2W0FC/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=foresta04-22&linkId=adbf92f544d165b7f09244caf5de0857&language=ja_JP" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00HC2W0FC&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=B00HC2W0FC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> \
{{< exlink src="https://amzn.to/2FUEqb7" text="PFU カラーキートップセット（HHKB Professionalシリーズ専用） PD-KB400KT01" >}}

上記はカラーキートップセットですが、キーキャップを引き抜く器具のみでも販売しているかと思うので探してみてください。

あとは、プラスドライバーがあれば作業を開始することができます。

作業全体を通して、だいたい1時間半から2時間くらいかかった気がするのでそのくらいの時間を確保しておけば良いでしょう。

## 作業開始

ではいよいよ作業を開始していきます。

以下の写真は実際に作業開始する前の写真です。(写っているプラスドライバーは大きさが合わずに使えなかったやつですが。)

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/prepare.jpg" >}}

### キーボードの開ける

まずは、キーボードを裏返してネジを外します。ネジは以下の画像の赤丸の箇所にあるのでそれぞれ準備したプラスドライバーで外していきます。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/keyboard-back.jpg" >}}

外すときに少し力がいるのですが、線で上下が繋がっているので慎重にあけます。\
開けると以下の画像のようにBluetooth用の基盤が線で繋がっているのが確認できます。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/open-keyboard.jpg" >}}

### Bluetoothの基盤を外す


この後、以下の画像の赤丸部分の線と基盤を外していくのが正しい手順なのですが、自分の場合この線がなかなか外せずにかなり苦戦しました。あまり力を入れすぎて線が断線しても怖かったので、結局この線は繋いだまま作業をしました。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/open-keyboard-2.jpg" >}}


Bluetooth用の基盤を外していくのですが、基盤はねじ止めと強力な粘着テープでとめられています。
ネジの位置は以下の画像を参考にしてください。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/open-keyboard-3.jpg" >}}

粘着テープを慎重に剥がしていくと、この基盤がはずれて以下の画像のようになります。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/remove-bluetooth-board.jpg" >}}

### 基盤を外す

次に、以下の画像の赤丸の位置にネジがとまっているのでこれらを外していきます。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/keyboard-back-board.jpg" >}}

ネジを全て外すと基盤がケースから外せるようになるのですが、以下の画像のようにグレーのゴムと基盤が現れます。このゴムがずれてしまうとキーが認識できなくなってしまうっぽいので、慎重に取り外します。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/board-with-rubber.jpg" >}}

基盤側はこの後の作業では使用しないので、一旦どこかに置いておきましょう。(裏側に強力な粘着テープがあるので、くっつきにくいところに置くのが良いでしょう。)


ここまでくるといよいよ終盤って感じがしてきます。\

### キーキャップを外す

次にキーキャップを外していきます。（本当はこの手順は最初にやったりするとよさそうなのですが、基盤を外すのに集中してたらすっかり忘れてました。）

キーキャップは専用の器具をつかって無心で外していきます。\
外したキーは並べて置くと戻すときに楽なのでおすすめです。

### 軸を外す

次にやることは、キーの軸を外すことです。\
軸の外し方ですが、表側から親指の爪を使ってぐいっと押してあげると外すことができます。
結構バキッて音がしたりするので怖いですが、自分の場合特に問題はありませんでした。

いくつか外した状態なのが以下の写真です。\
下の写真は裏側から撮影したものなのでこの写真の筐体の裏側から親指で押していくことになります。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/key-base.jpg" >}}

### O-Ringを装着する

前の手順で外した軸にO-Ringを装着していきます。

作業中の心境

{{< tweet 1114509954012999685 >}}


面倒だとか言いつつ結構ノリノリでもくもくと作業してました。こういう地味な作業意外と好きです。

O-Ringをつけた状態が以下の写真です。なんだかとても可愛いですね。

{{< figure src="/images/posts/hhkb_bt_keyboard_noise_reduction/oring.jpg" >}}

これを全ての軸にひたすら無心ではめていきます。

### 元に戻す

ここまでくればあとは、上記の手順を逆から行って組み立てていきます。

ここまで作業して結構疲れているかと思いますので、最後まで気を抜かずに慎重に組み立てていきましょう。

### 動作確認

元に戻したら、電源を入れて一応全てのキーが反応することを確認しました。\
無事すべてのキーが反応してよかったです。

ここまでで静音化の作業は完了です！ \

静かになったHHKBの打ち心地を楽しみましょう。

{{< tweet 1114519959638429697 >}}

## まとめ

今回は、HHKB BTの静音化にチャレンジしてみました。\
値段が値段だけに失敗できないという緊張感のもと、慎重に作業していたので結構疲れました。

O-Ringをはめただけなのですが、はめる前に比べるとかなりタイピング感や、音が変わります。\
Type-Sの打感が好きな方には本当におすすめです。

(が、あくまで自己責任でチャレンジしてみてくださいね。HHKBの分解・改造は、製造元であるPFUの保証外になります。)

## 参考サイト

* {{< exlink "https://gadget-touch.info/2019/02/01/hhkbbt-silent/" >}}
* {{< exlink "https://qiita.com/zebult/items/8733e7c8357a83f2af42" >}}

