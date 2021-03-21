+++
title="AtCoder を Rust で解くなら，cargo-compete かなり便利"
date="2021-03-21T23:05:55+09:00"
categories = ["engineering"]
tags = ["atcoder", "competitive-programming", "rust"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Rust で AtCoder に参加しているのですが，以前は CLion を用いてコードを書いていました．

その時の記事は以下になります．

- {{< exlink href="/posts/build_per_file_at_clion" text="競技プログラミングのためのCLion環境を構築した" >}}

今回は neovim だけで環境が整うように，色々探していたところ {{< exlink href="https://github.com/qryxip/cargo-compete/blob/master/README-ja.md" text="cargo-compete" >}} というすばらしいライブラリを見つけてこれを使ったら，非常に AtCoder がやりやすくなったので，簡単に紹介します．

## インストールと前準備

コンテストの前にインストールと前準備をする必要があります．

以下のとおりです．

```bash
$ cargo install cargo-compete
```

```bash
# AtCoder用のディレクトリ作成
$ mkdir atcoder
$ cd atcoder

# atcoder ように初期化
$ cargo compete init atcoder
```

## コンテストの流れ

コンテストは以下のような流れでおこなってきます．

```bash
# コンテスト開始後，コンテストを作成
# 以下は ABC196 の例
$ cargo compete new abc196

# 上記でできるディレクトリへ移動
$ cd abc196

# 問題ページをブラウザで開く
$ cargo compete open

# rust でコードを解く. a 問題のファイルを開いている例
$ nvim ./src/bin/a.rs

# a 問題のテスト
$ cargo compete test a

# a 問題のサブミット
$ cargo compete submit a
```

上記のように，ブラウザ上で操作することなく，CLI上で submit までできるのがとても便利です．

## まとめ

今回は，AtCoder などの競技プログラミングを Rust でときたい場合に便利な {{< exlink href="https://github.com/qryxip/cargo-compete/blob/master/README-ja.md" text="cargo-compete" >}} を簡単に紹介しました．

基本的には，公式のREADME や，CLIコマンドの help を見れば使い方はわかるので Rust で AtCoder などを解く際には一度試してみると良いと思います．自分は圧倒的にAtCoder が楽になりました．

今後も AtCoder 精進していきたいと思います．
