+++
title="M1 Mac に sbt を入れて Scala 3 の REPL を使用する"
date="2021-09-26T21:20:37+09:00"
categories = ["engineerint"]
tags = ["scala", "sbt", "java", "jenv"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、sbt をインストールして、scala 3 の REPL を使えるようにしたので、対応内容をメモします。

## Java のインストール

sbt を使用するために、Java 8 系をインストールします。

自分は、Amazon Corretto 8 をインストールしました。

{{< exlink href="https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/downloads-list.html" text="Amazon のサイト" >}} から macOS x64 の 拡張子が pkg の方をダウンロードしました。

落としてきたら、pkg を実行して、そのままインストールをします。

自分の環境だと jenv を使って java のバージョンを管理しているので、以下のコマンドでインストール先を確認して、`jenv add` をします。

```bash
$ /usr/libexec/java_home --verbose
Matching Java Virtual Machines (2):
    17 (arm64) "Homebrew" - "OpenJDK 17" /opt/homebrew/Cellar/openjdk/16.0.2/libexec/openjdk.jdk/Contents/Home
    1.8.0_302 (x86_64) "Amazon" - "Amazon Corretto 8" /Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home


$ jenv add /Library/Java/JavaVirtualMachines/amazon-corretto-8.jdk/Contents/Home
...
$ jenv versions 
  system
* 1.8 (set by /path/to/home/.jenv/version)
  1.8.0.302
  17
  corretto64-1.8.0.302
  openjdk64-17
```


上記までで、Java はインストール完了しました。

```bash
$ java -version
openjdk version "1.8.0_302"
OpenJDK Runtime Environment Corretto-8.302.08.1 (build 1.8.0_302-b08)
OpenJDK 64-Bit Server VM Corretto-8.302.08.1 (build 25.302-b08, mixed mode)
```

### sbt のインストール

次に、sbt をインストールします。

intel CPU の mac であれば、`brew install sbt` で入りますが、M1 Mac は以下のようなエラーが出ました。

```bash
$ brew install sbt

sbt: The x86_64 architecture is required for this software.
Error: sbt: An unsatisfied requirement failed this build.
```

なので、{{< exlink href="https://www.scala-sbt.org/1.x/docs/ja/Installing-sbt-on-Mac.html#%E3%83%A6%E3%83%8B%E3%83%90%E3%83%BC%E3%82%B5%E3%83%AB%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%8B%E3%82%89%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB" text="こちらのページ" >}} からユニバーサルパッケージからのインストールを行います。

ユニバーサルパッケージからのインストールにある zip をダウンロードしてきます。

落としてきた zip の中に、sbt の実行ファイルがあるので、パスが遠ているところ ( `/usr/local/bin` ) などにコピーすればインストール完了です。

```bash
$ sudo mv ~/Downloads/sbt/bin/sbt /usr/local/bin

$ which sbt
/usr/local/bin/sbt

$ sbt -version
sbt version in this project: 1.5.5
sbt script version: 1.5.5
```

### sbt コンソールから REPL を起動


sbt のインストールが完了したら適当なプロジェクトを作成します。

自分は、Scala 3 の環境が欲しかったので、以下のコマンドでテンプレートを利用します。

```bash
$ sbt new lampepfl/dotty.g8
```

実行すると、プロジェクト名など聞かれるので適当に入力します。

作成されたディレクトリで、sbt コマンドを打ってREPLを起動します。

```bash
$ sbt

# sbt が立ち上がったら、console コマンドで REPL を立ち上げる
sbt:scala3-simple > conosle
```

これで、REPLが立ち上がったので適当にScalaコードを入力して確認することができます。

```bash
scala> val x = 5 
val x: Int = 5

scala> val y = 5L
val y: Long = 5
```

## まとめ

今回は、M1 Mac に sbt をインストールし、REPL を起動するところまでにやったことをメモしました。
[以前の記事](/posts/setup_scala/) で IntelliJ 上からは実行できるようになっていたのですが、REPL も欲しかったので sbt を使ってインストールする手順を行ってみました。

M1 Mac だと sbt が Homebrew で install できなかったりするので注意が必要そうです。
