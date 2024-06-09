+++
title="ubuntu のターミナルを Warp にしてみる"
date="2024-06-09T19:07:51+09:00"
categories = ["engineering"]
tags = ["terminal", "cli"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Warp というターミナルの存在は知っていたのですが、Ubuntu でも使えるということを知ったので、早速 インストールして使ってみようと思います。

-   {{< exlink href="https://www.warp.dev/" >}}

## インストール手順

{{< exlink href="https://www.warp.dev/" text="TOP ページ" >}} に行くとダウンロードリンクがあるのでポチッと押してダウンロードします。

(windows 版はまだないらしく、Waitlist に登録しておけるようです。)

{{< figure src="/images/posts/try-using-warp-for-ubuntu/warp-top-page.png" >}}

自分は、ubuntu の環境なので `.deb` を落とします。
落としたらそのままインストールします。

Sign up 画面がでてくるので、指示通り Signup しました。

{{< figure src="/images/posts/try-using-warp-for-ubuntu/warp-signup.png" >}}

## いろいろな機能

登録すると、いろいろな初期設定が行えます。テーマ設定とかできますがこの時点でリッチで良い感じです。

{{< figure src="/images/posts/try-using-warp-for-ubuntu/settings.png" >}}

ひときわ目立つのが右側にある、Warp AI です。

{{< figure src="/images/posts/try-using-warp-for-ubuntu/warp-ai.png" >}}

例えばコマンドをど忘れしたみたいなときに AI に雑に聞けるのは非常に便利そうだなと思いました。

見た目の変更もいろいろできそうで、最初に開いた際に日本語フォントがデフォルトで明朝体っぽいものになっていたのが気になったので修正しました。

Ubuntu では `Ctrl + ,` で設定画面を開くことが出来ます。

{{< figure src="/images/posts/try-using-warp-for-ubuntu/warp-settings.png" >}}

Appearance から設定をいじることができそうでした。 自分は一旦 DejaVu Sans mono に落ち着きました。

他にも自分で Theme を作って yml で管理することなどもできそうです。

-   {{< exlink href="https://docs.warp.dev/appearance/custom-themes" >}}

また、`Ctrl + Shift + P` でコマンドパレットを開くことが出来て、そこから画面の分割など様々なことができそうです。（この辺は VSCode に似てるかなと思いました。）

{{< figure src="/images/posts/try-using-warp-for-ubuntu/warp-command-pallete.png" >}}

他にもいろいろなことができそうですので、以下の公式ページの FEATURES の項目を見てみると面白いと思います。

-   {{< exlink href="https://docs.warp.dev/features/command-palette" >}}

## まとめ

Ubuntu で Warp を使ってみて簡単な初期設定までやってみました。かなりいろいろな機能がついていて、多機能ターミナルという感じでした。
まだまだできることが多そうなのでドキュメントみつつ、いろいろ触ってみようと思います。
