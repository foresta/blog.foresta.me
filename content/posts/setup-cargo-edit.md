+++
title="cargo-editが便利だったので導入してみた"
date="2020-03-22T20:45:10+09:00"
categories = ["engineering"]
tags = ["rust", "cargo", "cargo-edit"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Rust でコードを書く際には、Cargo というパッケージマネージャを使用するのですが、cargo-edit という cargo の拡張を使用したらとても便利だったので、そのことについて書いていきます。

## cargo-edit でできること

Rust で crate を用いる場合は、Cargo.toml ファイルに以下のように、記述をして cargo run で実行することで利用することができます。

##### Cargo.toml

```
[package]
name = "package-name"
version = "0.1.0"
authors = ["kz_morita <kz.morit@gmail.com>"]
edition = "2018"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
libc = "0.2.0"

[build-dependencies]
cc = "1.0"
```

{{< exlink href="https://github.com/killercup/cargo-edit" text="cargo-edit" >}} を用いると以下のようなコマンドを打つことで、自動的に上記のような Cargo.toml を生成し、外部 crate を使えるようになります。

```bash
$ cargo add libc@0.2.0
$ cargo add cc@1.0 --build
```

JavaScript の開発をする方は、`npm install --save` のようなことができるようになる拡張というのがわかりやすいかもしれないです。

cargo-edit のその他の詳しい内容については、公式の README を参照してみてください。
https://github.com/killercup/cargo-edit

## 導入

さっそくインストールしてみます。インストール自体は簡単で以下のコマンドで行えます。

```bash
$ cargo install cargo-edit
```

### ビルドエラーになる場合

自分の環境だと、cargo install がコンパイルエラーになりました。

```
   Compiling subprocess v0.2.4
error[E0658]: the `#[non_exhaustive]` attribute is an experimental feature
    --> /Users/username/.cargo/registry/src/github.com-1ecc6299db9ec823/subprocess-0.2.4/src/popen.rs:1231:1
     |
1231 | #[non_exhaustive]
     | ^^^^^^^^^^^^^^^^^
     |
     = note: for more information, see https://github.com/rust-lang/rust/issues/44109
```

subprocess でコンパイルエラーになっているのですが、`non_exhaustive` Attribute が使用できないことによるエラーでした。

調べてみると、`non_exhaustive` Attribute は、Rust 1.40 から stable に入った機能でした。

手元の Rustc のバージョンを調べてみたところ、1.39 だったためアップデート行えば良さそうだとわかりました。

```bash
$ rustc -V
rustc 1.39.0 (4560ea788 2019-11-04)
```

{{< tweet 1241588154890473473 >}}

#### 参考

- https://blog.rust-lang.org/2019/12/19/Rust-1.40.0.html
- https://news.ycombinator.com/item?id=21836053

### rust のアップデート

rust のアップデートは `rustup` を用いれば良いらしいので、アップデートして行きます。

まずは、rustup 自身のアップデートから。

```bash
$ rustup -V
rustup 1.20.2 (13979c968 2019-10-16)

$ rustup self update
# 省略
# ...

$ rustup -V
rustup 1.21.1 (7832b2ebe 2019-12-20)
```

そして、rust のアップデートを行います。

```bash
$ rustc -V
rustc 1.39.0 (4560ea788 2019-11-04)

$ rustup update
# 省略
# ...

$ rustc -V
rustc 1.42.0 (b8cedc004 2020-03-09)
```

無事、1.42 をインストールすることができました。

これで当初の目的であった、cargo-edit をインストールしたら無事完了しました。

```bash
$ cargo install cargo-edit
```

## まとめ

今回は、Cargo をより便利にする拡張である `cargo-edit` についてと、導入について紹介しました。
Rust 自体をアップデートする作業を行いましたが、ツールチェインがかなり便利で快適に利用できるためとても楽に更新作業が行えました。

また、ビルドエラーも非常にわかりやすく特につまづくことなく解消できたのは Rust のとても良いところだと思います。

## おまけ `non_exhaustive` attribute について

以下の記事がとてもわかりやすかったので参考になると思います。

{{< exlink "https://qiita.com/termoshtt/items/b224b95f666ce8560d58" >}}

簡単に説明すると、外部に公開するライブラリで Enum を扱う時に Enum の追加などの更新により、ライブラリ使用側のコードがエラーになるのを防ぐためにつける Attribute になります。

具体的なコードで説明すると、Enum が以下のように定義され、公開されているとします。

```rust
pub enum Color {
	Red,
	Blue,
	Yellow,
}
```

使用する側は、以下のようにパターンマッチを行っているとします。

```rust
match color {
	Red => ...,
	Blue => ...,
	Yellow => ...,
}
```

この時に、Color に `White` を追加するとすると、上記のパターンマッチしている箇所がエラーになります。
Enum の要素の追加により、コンパイルエラーにならないためには以下のようにパターンマッチを行う必要があります。

```rust
match color {
	Red => ...,
	Blue => ...,
	Yellow => ...,
	_ => ...,
}
```

このような `_` を利用したパターンマッチを使用者側に強制させるのが、`non_exhaustive` Attribute です。

```rust
#[non_exhaustive]
pub enum Color {
	Red,
	Blue,
	Yellow,
}
```

のように利用すると、

```rust
pub enum Color {
	Red,
	Blue,
	Yellow,
	__Nonexhaustive,
}
```

のように、外部には隠された要素が追加されます。
このことにより、外側からは以下のように利用しないとコンパイルエラーになります。

```rust
match color {
	Red => ...,
	Blue => ...,
	Yellow => ...,
	_ => ...,
}
```
