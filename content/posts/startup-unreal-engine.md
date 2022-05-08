+++
title="Unreal Engine をインストールして遊んでみる"
date="2022-05-08T22:10:56+09:00"
categories = ["engineering"]
tags = ["unreal-engine", "ue5"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Windows で Unreal Engine をインストールして少し遊んでみたのでそのメモです。

## インストール

Unreal Engine は Epic Games が作成しているゲーム開発のフレームワークで、公式サイトからダウンロードすることができます。

- {{< exlink href="https://www.unrealengine.com/ja/download" >}}

Unreal Engine をインストールするのですが、一応手順的には

- Epic Games Launcher をインストール
- Unreal Engine をインストール

となります。

ちなみに、自分の環境では nVIDIA の GeForce のドライバが推奨バージョンではなかったのでダウンロードしてインストールしました。

- {{< exlink href="https://www.nvidia.com/en-us/geforce/drivers/">}}

MANUAL DRIVER SEARCH とういう箇所で、自分の環境の `GeForce RTX 3060 Ti` を指定してインストールしました。


## チュートリアル

まず、インストールをしてプロジェクトを作成しました。

起動すると以下のような画面が表示されて、テンプレートを選択できます。

{{< figure src="/images/posts/startup-unreal-engine/create-project.png">}}

試しに、サードパーソンのテンプレートを選択してプロジェクト名などを設定し、作成ボタンを押すと以下のような画面が立ち上がります。


{{< figure src="/images/posts/startup-unreal-engine/ue5-screenshot.png">}}

この状態で、実行ボタンを押すとすでに TPS のゲームっぽいテンプレートがすでに作られていてすでにキャラクターが動き回るゲームのようなものができています。
テンプレートすごいですね。


基本的にこの画面上でいろいろと操作をしてゲームを使っていくことになると思います。

ちなみに、公式でチュートリアルが用意されているのでしばらくはこれを進めてみようと思います。

- {{< exlink href="https://www.unrealengine.com/ja/onlinelearning-courses" >}}

## まとめ

今回は、Unreal Engine をインストールして動かしてみました。
なかなかに高機能なのと、C++ でコードがかけるようなのでいろいろと触ってみようと思います。

ゲーム以外にも、いろいろなシミュレーションなどもできそうなので面白そうです。


