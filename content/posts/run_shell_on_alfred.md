+++
date = "2017-07-07T13:14:25+09:00"
title = "alfred上でshellを実行する"

categories = ["engineering"]
tags = ["osx", "alfred"]
+++

日頃開発をしていて、面倒な作業をshellにするのはよくやられていることだと思うが、
毎回ターミナルから実行するのがちょっと面倒だった。

自分は[alfred](https://www.alfredapp.com/)というランチャーソフトをつかっていて、Alt + Spaceで簡単によびだせる設定にしているので、ここからshellを実行できないもんかなーと思って調べてみたらできたのでまとめてみる。

## 環境

* OS X El Capitan
* Alfred 1.2

## 方法

* 任意のシェルを作成する(hoge.sh)とする
* 実行権限をつける
* hoge.shをhoge.appにリネーム
* alfredから実行

これだけ。

シェルを作成しただけだと以下のようになって実行はできない。

{{< figure src="/images/posts/run_shell_on_alfred/alfred_sh.png" >}}

がリネームするとこうなる。

{{< figure src="/images/posts/run_shell_on_alfred/alfred_app.png" >}}

ためしにデスクトップ通知をするだけのshellを書いてみる。

hoge.sh

```bash
#!/bin/bash↲

if [ "$(uname)" == 'Darwin' ]; then↲
  # デスクトップ通知↲
  osascript -e 'display notification "hogehoge" with title "title"'↲
fi↲
```

これを実行すると次のようにちゃんと実行できる。

{{< figure src="/images/posts/run_shell_on_alfred/notification_desktop_hoge.png" >}}

これは色々とはかどりそうで良いぞ。

こういうのでどんどん開発効率を上げていきたいですね。

