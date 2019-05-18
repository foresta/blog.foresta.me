+++
categories = ["engineering"]
date = "2019-05-19T00:00:00+09:00"
title = "SwiftのColor Literalが良さそうだった話"
thumbnail = ""
tags = ["swift", "ios", "xcode"]
+++

こんにちは、[kz\_morita](https://twitter.com/kz_morita)です。\
最近はもっぱらiOSエンジニアとしてSwiftを書いています。

今回は XCode8 から使えるようになった、Color Literalを最近になって初めて知り便利そうだなと感じたのでそれをすごく簡単に紹介します。

## Editor上で色が直感的にわかる

Color Literalの最大の特徴は何と言ってもエディタ上で色がとても分かりやすく見えることにあると思います。

{{< figure src="/images/posts/swift_color_literal/color_literal.png" >}}

## 定義の方法は簡単

以下の画像のようにUIColorの変数を定義し、初期化時に `color` などと入力すればサジェストされるためそれを選べばOKです。

{{< figure src="/images/posts/swift_color_literal/setting.png" >}}


定義後色を変更すのも、色が出ている箇所をダブルクリックすると、以下のようにColor Pickerが現れ色を変更することができます。

{{< figure src="/images/posts/swift_color_literal/setting_2.png" >}}

## まとめ

* コード上で色が可視化されているため作業のしやすくなりそう
* 設定の仕方も簡単

今回偶然知ることができたのですが、まだまだ知らない機能もたくさんあるんだろうなぁと思い知りました。\
一回体系的に調査して学んでおくと後々役立ちそうな気がしますね。

