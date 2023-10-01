+++
title="WSL 上に構築した Rust 環境から Windows 向けにクロスビルドする"
date="2023-10-01T13:51:00+09:00"
categories = ["engineering"]
tags = ["rust", "wsl"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、WSL 上で Rust の開発を行い、Windows 上でそれを実行するためクロスビルドするための方法についてまとめます。

## 対象のソースコード

今回は、WindowsAPI を Rust から叩くようなアプリケーションをWSL 上で実装して、Windows 向けにクロスビルドして動かしてみます。

具体的には、MessageBox API を叩いて Windows 上で MessageBox を表示してみます。
WindowsAPI を叩くために {{< exlink href="https://crates.io/crates/windows" text="windows">}} crate を使用します。

ソースコードには、{{< exlink href="https://learn.microsoft.com/ja-jp/windows/dev-environment/rust/rss-reader-rust-for-windows#showing-a-message-box" text="Microsoft公式のこちら">}} に記載されているものを利用しています。


以下 Cargo.toml です。

##### Cargo.toml
```toml
[package]
name = "win_message_box"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]

[dependencies.windows]
version = "0.43.0"
features = [
    "Win32_Foundation",
    "Win32_UI_WindowsAndMessaging"
]
```

以下ソースコードです。

##### src/main.rs

```rs
use windows::{core::*, Win32::UI::WindowsAndMessaging::*};

fn main() {
    unsafe {
        MessageBoxA(None, s!("Ansi"), s!("World"), MB_OK);
        MessageBoxW(None, w!("Wide"), w!("World"), MB_OK);
    }
}
```

## クロスビルドをする

クロスビルドために以下の {{< exlink href="https://crates.io/crates/cross" text="cross" >}} crate を Install して、`cross` コマンドを使えるようにします。

```bash
$ cargo install cross
```

内部で Docker を使用してビルド環境を自動で用意してくれるっぽく Docker 環境もおそらく必要です。

cross build は、以下のようなコマンドで実施します。

```bash
$ cross build --target {TARGET_NAME}
```

TARGET_NAME は以下のコマンドで確認できます。

```bash
$ rustup target list
```

windows 向けのビルドなので grep しても良いかもしれません。
```bash
$ rustup target list | grep windows
arch64-pc-windows-msvc
i586-pc-windows-msvc
i686-pc-windows-gnu
i686-pc-windows-msvc
x86_64-pc-windows-gnu (installed)
x86_64-pc-windows-msvc
```

今回は以下のようにしました。

```bash
$ cross build --target x86_64-pc-windows-gnu
```

実行すると build が始まり終了すると `target/x86_64-pc-windows-gnu/debug/win_message_box.exe` というファイルが生成されます。


このファイルを無事実行 (WSL 上からでも実行できる) できると、以下のように Windows 側で以下のような message box が表示されます。

{{< figure src="/images/posts/rust-cross-build-for-windows-on-wsl/messagebox.png">}}

## まとめ

今回は、WSL 上に構築した Rust の環境から Windows 向けにクロスビルドする方法についてメモしました。

`cross` という便利な crate があり思ったより簡単に cross build ができました。WindowsAPI も create が用意されていたりとツールチェインが整っていて助かりました。
