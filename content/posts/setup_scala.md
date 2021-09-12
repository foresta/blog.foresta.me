+++
title="Scala と IntelliJ で開発環境のセットアップ"
date="2021-09-12T19:40:14+09:00"
categories = ["engineering"]
tags = ["scala", "intellij"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

[前回の記事](/posts/setup_java_with_jenv) で、Java のセットアップをしたので続いて Scala を実行するところまでセットアップします。

## セットアップ

IDE は、IntelliJ を使用しようと思うのでインストールします。Community 版を公式サイトからダウンロードします。

- https://www.jetbrains.com/ja-jp/idea/download/#section=mac

自分の環境は、M1 なので、Apple Silicon 版をダウンロードします。

IDE を起動して、Plugins を選択します。

{{< figure src="/images/posts/setup_scala/open-ide.png" >}}

開いたら、Scala の Plugin をインストールして、IDE を再起動します。

{{< figure src="/images/posts/setup_scala/install-scala-plugin.png" >}}

Scala を選択して、初回なので Scala の SDK などをダウンロードします。

{{< figure src="/images/posts/setup_scala/select-scala.png" >}}

Use Library の右の `Create...` を押して Scala のバージョンを入力します。今回は 2021 年 9 月 12 日 時点で最新の、3.0.2 を選択しました。

{{< figure src="/images/posts/setup_scala/download-scala.png" >}}

ダウンロードが完了したらプロジェクトの情報を入力して、作成します。

{{< figure src="/images/posts/setup_scala/create-project.png" >}}

ここまでできたらセットアップは完了であとは以下のようにコードを書き、実行ができるはずです。

```scala
object Main extends App {
  println("Hello Scala")
}
```


## まとめ

今回は、Scala を使うための IntelliJ のセットアップを画像付きでメモしておきました。
IntelliJ がかなり親切なので、フローに従ってセットアップしていけば悩むことはなさそうでしたが、備忘録として残しておきます。

