+++
title="WSL 上に IntelliJ を入れて Scala を開発する"
date="2023-06-11T19:06:17+09:00"
categories = ["engineering"]
tags = ["intellij", "scala", "wsl"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

[以前の記事](https://blog.foresta.me/posts/scala-in-wsl/) で、WSL 上に Scala をインストールしたのですが、このときはWindows側にインストールした IntelliJ から、sbt プロジェクトが import できずに IntelliJ での開発を断念しました。

今回は、WSL に IntelliJ を Install して Scala を開発するところまでをやってみます。

## 準備

まず、WSL 上で GUI アプリケーションを動かすための準備をします。

- {{< exlink href="https://learn.microsoft.com/ja-jp/windows/wsl/tutorials/gui-apps" >}} 

上記の公式サイトに書かれていますが、wsl を update して 再起動します。

管理者権限で Powershell を起動して、以下のコマンドでアップデートと再起動を行います。

```Powershell
> wsl --update
> wsl --shutdown
```

次に実際に GUI アプリが動くかどうかを試すために、Ubuntu で使えるファイラである、`nautilus` をインストールします。

```bash
$ sudo apt install nautilus -y
```

ちなみに自分の環境では、上記コマンドが 404 Not Found になってインストールできなかったのですが、update を一度したら正常にインストールできました。

```bash
$ sudo apt update
```

インストールができたら、起動してみます。

```bash
$ nautilus
```

以下のようなアプリが立ち上がれば成功です。

{{< figure src="/images/posts/intellij-on-wsl/nautilus.png" >}}


## IntelliJ をインストールする

上記までで、GUI アプリケーションを起動する準備ができたので、実際に IntelliJ を入れていきます。今回は Community Edition を入れていきます。

```bash
# Download
$ wget https://download.jetbrains.com/idea/ideaIC-2023.1.2.tar.gz

# Unzip 
$ sudo tar -xvf ideaIC-2023.1.2.tar.gz

# Run
$ ./idea-IC-231.9011.34/bin/idea.sh
```

実行すると無事立ち上がりました。

Scala プラグインなどを入れて再起動して後に、build.sbt を Project として開いたら無事に動くことまで確認できました。

{{< figure src="/images/posts/intellij-on-wsl/intellij.png" >}}

## まとめ

今回は、WSL に IntelliJ を入れて Scala アプリケーションが実行できるところまで実施しました。

以下の記事を非常に参考にさせていただきました。(自分の過去記事も参照いただけていてありがとうございます)

- {{< exlink href="https://dk521123.hatenablog.com/entry/2023/06/10/034839" >}}


