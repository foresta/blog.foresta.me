+++
title="WSL2 上にブログ執筆環境を構築する"
date="2022-04-10T23:10:58+09:00"
categories = ["engineering"]
tags = ["wsl2", "blog"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、WSL2 (Ubuntu) 上にブログ執筆環境を構築したのでその作業メモを残します。

## やることリスト

- wsl setup
- Windows Terminal をインストール
- GitHub まわりの設定
- neovim のインストール
- hugo のインストール
- node.js のインストール

それぞれメモを残していきます。

### wsl setup

wsl の setup は簡単で、PowerShell で以下のコマンドを入力するだけです。

```bash
$ wsl --install
```

デフォルトで Ubuntu がインストールされます。オプションでどのディストリビューションで作成するかも選択できます。

詳しくは以下を見るとよさそうです。

{{< exlink href="https://docs.microsoft.com/ja-jp/windows/wsl/install" >}}

install 後は、User の作成などを実施しました。

デフォルトでは、root ユーザーでログインしていたので以下のコマンドでユーザーを作成しました。
(kz_morita となっているところは適宜ユーザー名に読み替えてください) 

```bash
$ adduser kz_morita
$ gpasswd -a kz_morita sudo
```

これでユーザーは作成できたので、デフォルトユーザーに設定します。

PowerShell で以下を実行します。

```bash
$ ubuntu config --default-user kz_morita
```

### Windows Terminal をインストール

Windows で使用するターミナルですが、Windows Terminal というものがよさそうだったのでこちらをインストールしました。

{{< exlink href="https://www.microsoft.com/ja-jp/p/windows-terminal/9n0dx20hk701?rtc=1&activetab=pivot:overviewtab" >}}

### GitHub まわりの設定

こちらは、主に ssh鍵ペアを作って GitHub 上に登録します。

```
$ ssh-keygen -t ed25519 -C "{mail adddress}"
```

よくこちらの記事を参考にしてます。

{{< exlink href="https://qiita.com/suthio/items/2760e4cff0e185fe2db9">}}

### neovim のインストール

次に neovim のインストールを実施しました。

neovim のインストールは以前に書いたこちらの記事を参考にしました。

[Ubuntu のセットアップメモ](/posts/setup_ubuntu_log/)


### hugo のインストール

hugo はバイナリを直接インストールしました。

自分は、v0.89.0 を使用しているので、こちらからダウンロードして `/usr/local/bin` などパスの通っているディレクトリに配置して完了です。

{{< exlink href="https://github.com/gohugoio/hugo/releases/tag/v0.89.0" >}}


### node.js のインストール

ブログの静的コンテンツをビルドするために、node が必要なためこちらも以前書いた記事を参考に入れました。

[Ubuntu のセットアップメモ](/posts/setup_ubuntu_log/)

## まとめ

今回は、新しく買った Windows の WSL2 (Ubuntu) 上に、ブログの執筆環境を構築しました。
WSL と ネイティブの Windows で若干勝手がちがうところがあって躓きましたが、割とサクッと環境構築できてよかったです。

Windows上で開発を行うのは、しばらく行ってなかったのですが WSL などいろいろと整っていて全然 Windows でも行けそうだなと思いました。
若干の環境差分はあると思うので、つまづいたらまたブログ書いていこうかなと思います。

