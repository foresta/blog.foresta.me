+++
title="vscode で図を書く書くための Plugin"
date="2023-01-15T19:00:45+09:00"
categories = ["engineering"]
tags = ["vscode", "draw.io", "mindmap"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段 vscode をテキストエディタとして使用しているのですが、グラフィカルな図をメモとして書きたいと思ったときに、vscode 上でかけるプラグインがいくつかあったのでメモです。

## draw.io

{{< exlink href="https://drawio-app.com/" text="draw.io" >}} は、グラフをかける web サービスですが、vscode プラグインがあったので紹介します。

- {{< exlink href="https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio" >}}

{{< figure src="/images/posts/draw-graph-with-vscode/drawio-plugin.png" >}}

一番上の、Draw.io Integration をインストールします。

拡張子を、`.drawio`, `.dio` でファイルを作成すると、drawio の画面が開けるようになります。 


以下のように基本的な図形を描画できるので便利そうです。
{{< figure src="/images/posts/draw-graph-with-vscode/draw-graph.png" >}}

詳しい図形の書き方などは、draw.io と同じなので使ったことがあればかけるかなと思います。
操作自体も直感的なので触ってくうちにわかるとは思います。

## mindmap 

マインドマップなどもかけないかなと思って探してみたところ良さそうなものがありました。

- {{< exlink href="https://marketplace.visualstudio.com/items?itemName=pmcxs.vscode-mindmap" >}}

日本語対応している i18n バージョンをダウンロードします。


{{< figure src="/images/posts/draw-graph-with-vscode/mindmap-plugin.png" >}}

拡張子 `.km` でファイルを作成すると mindmap を開くことができます。

{{< figure src="/images/posts/draw-graph-with-vscode/draw-mindmap.png" >}}

この mindmap ですが、基本的にキーボードで操作でき、Enter で 兄弟ノード追加、Tab で子ノード追加のようになっているためとても便利です。

## まとめ

今回は、vscode 上で図がかける、draw.io の plugin と mindmap 用の Plugin を紹介しました。

どちらも良い点としては、ファイルの実態は text ファイル (drawio は xml 形式, mindmap は JSON) なので、github などでドキュメントのバージョン管理がしやすいです。

コードなどと一緒にコミットしておくとメンテナンスしやすいかと思います。

普段開発していて、チームメンバー間の共通認識をそろえるために、図は非常に便利なコミュニケーションツールだなと感じているのでこういった Plugin などをうまく使っていきたいと思いました。

