+++
title="Ubuntu の neovim 上での rust-analyzer を Setup する"
date="2024-02-18T12:02:53+09:00"
categories = ["engineering"]
tags = ["rust", "neovim", "coc"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

久しぶりにサブ機の ThinkPad を持ってお出かけして，よし Rust 書くぞ − となったら neovim 上でのコード補完が効かなかったので直したりしたときのログです．

## 環境

```bash
$ cat /etc/os-release
NAME="Ubuntu"
VERSION="18.04.6 LTS (Bionic Beaver)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 18.04.6 LTS"
VERSION_ID="18.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=bionic
UBUNTU_CODENAME=bionic
```

rust 自体はインストールしていて，ただし，rust-analyzer はインストールしていないという状況でい s た．

## やったこと

まずは，rust も古かったのでアップデート

```bash
$ rustup update

$ rustc --version
rustc 1.78.0-nightly (bccb9bbb4 2024-02-16)
```

次に rust-analyzer をインストールです．こちらも rustup からインストールできるみたいなのでやりました．

```bash
$ rustup component add rust-analyzer

$ rust-analyzer --version
rust-analyzer 1.78.0-nightly (bccb9bb 2024-02-16)
```

coc 自体は，neovim にインストール済みだったので，`:CocInstall coc-rust-analyzer` を実行して動かしました．

これで動くかな − と思ったところ，以下のようなエラーが出ました．

```
"jumpDefinition": definition provider not found for current buffer, your language server don't support it
```

コードジャンプが効かなかったのですが，原因としては node のバージョンが古いということでした．

node が v12 系でむっちゃ古かったので，とりあえず v16 系をインストールし，一応上記の rust-analyzer 周りの install をもう一度実行したところ正常に動きました．

なんで node が関係あるんだろうと思ったのですが，`coc-rust-analyzer` は TypeScript で実装されていて，その影響によるものっぽかったです．

下記の記事で実際にコードまで深堀られていたので参考になりました．

-   {{< exlink href="https://zenn.dev/kbwok/articles/coc-rust-analyzer-m1" text="M1 Macでcoc-rust-analyzerが一部機能しない場合" >}}

## まとめ

今回は， neovim 上で Rust の環境を Setup した内容をメモしました．ことあるごとに環境構築してる気がしますが，これで気持ちよく Rust かけそうです．
