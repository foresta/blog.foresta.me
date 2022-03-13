+++
title="Rust 製のデスクトップアプリ開発フレームワークの Tauri を触ってみる"
date="2022-03-12T19:38:39+09:00"
categories = ["engineering"]
tags = ["tauri", "rust"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、{{< exlink href="https://www.publickey1.jp/blog/22/electronrusttauri.html" text="こちらの記事" >}} で紹介されていた、Electron の大体を目指すデスクトップアプリ開発のフレームワークである、Tauri を触ってみます。

## 環境構築

Tauri は以下で公開されています。

- {{< exlink href="https://github.com/tauri-apps/tauri" >}}

自分の環境は macOS なので以下を参考に構築しました。

- {{< exlink href="https://tauri.studio/docs/getting-started/setting-up-macos" >}}


以下のコマンドで、アプリを作成します。

```
$ yarn create tauri-app
```

プロジェクト名と、Windowのタイトルと、初期セットアップを設定します。

初期セットアップは、React やら Vue やら、バニラやらを選択できます。

バニラを選択すると以下のようなディレクトリ構造になりました。

```
.
├── dist
│   └── index.html
├── node_modules/
│   ├── @tauri-apps
│   │   ├── api/
│   │   ├── cli/
│   │   └── cli-darwin-arm64
│   │       ├── README.md
│   │       ├── cli.darwin-arm64.node
│   │       └── package.json
│   └── type-fest
│       ├── index.d.ts
│       ├── license
│       ├── package.json
│       ├── readme.md
│       └── source/
├── package.json
├── src-tauri
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── build.rs
│   ├── icons/
│   ├── src
│   │   └── main.rs
│   ├── target/
│   └── tauri.conf.json
└── yarn.lock
```

以下のコマンドで実行することができます。

```
# yarn
$ yarn run tauri dev

# cargo
$ cd ./src-tauri
$ cargo run 
```

実行すると以下のような画面が表示されます。

{{< figure src="/images/posts/try-tauri/myapp.png" >}}

## Rust 側との連携

Tauri は、Backend 側を Rust で書くことができるため、View を HTML / CSS / JavaScript で記述して、ロジックを Rust で書いたりすることができそうです。

Rust と JavaScript で連携して、カウンターを実装すると以下のようになります。

### Rust 側

Rust 側は以下のようなコードになります。

#### /src-tauri/src/main.rs
```rust
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::atomic::{AtomicI32, Ordering};

// カウンタ変数 
// Rust 側で State 管理ができる 
struct IncrementValue(AtomicI32);

// tauri::command マクロをつけることで、FrontEnd 側から呼び出せるようになる
// tauri::State を引数に取ることで State にアクセスできる
#[tauri::command]
fn increment(state: tauri::State<IncrementValue>) -> i32 {

    // Rust で出した標準出力は、アプリを実行しているコンソールに表示される
    println!("incremented!!");

    // カウントアップ
    state.0.fetch_add(1, Ordering::SeqCst) + 1
}

fn main() {
    tauri::Builder::default()
        .manage(IncrementValue(AtomicI32::new(0))) // Stateの初期化と設定
        .invoke_handler(tauri::generate_handler![increment]) // increment を handler として登録
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

やっていることは、

- JavaScript から呼び出す increment 関数の定義
- Stateを定義
- 関数、State を 設定

といったあたりです。これを View 側から呼び出していきます。

### View 側

#### /dist/index.html

HTML はカウントアップ用のボタンと数字表示用のエリアを用意しているだけです。
のちに紹介する `index.js` も読み込んでおきます。

```html
<!DOCTYPE html>
<html>
  <style>
    html,
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
  <body>
    <h1>tauri-sample</h1>
    <button id="increment_btn">Increment</button>
    <div id="result">0</div>
    <script src="index.js"></script>
  </body>
</html>
```

#### /dist/index.js

```js
// Rust 側のコードを呼び出すための invoke メソッド
// JS から呼び出すには、設定ファイルを修正する必要がある (後述)
const invoke = window.__TAURI__.invoke

const button = document.getElementById("increment_btn");
const resultView = document.getElementById("result");

button.addEventListener('click', (e) => {
  // JS 側のログは、WebView側の devtool で見れる
  console.log("Add increment button");

  // invoke は Promise が帰ってくるので、then や、catch で処理をかける
  // Rust 側で Result 型を返せば Error の時に catch 節が呼び出されるという挙動になる。
  invoke("increment").then((res) => resultView.innerText = res);
});
```

#### /tauri-src/tauri.conf.json

JS 側から invoke を呼び出すためには設定ファイルに以下を追加する必要があります。

```json
{
  "package": {
    "productName": "tauri-sample",
    "version": "0.1.0"
  },
  "build": {
    "distDir": "../dist",
    "devPath": "../dist",
    "beforeDevCommand": "",
    "beforeBuildCommand": "",
    "withGlobalTauri": true // <- ここを追加
  },
  "tauri": {
      // ...
  }
}
```

`"withGlobalTauri": true` を追加することで、JS から invoke メソッドが呼べるようになります。

これらを記載して実行すると以下のように、カウンタが実装できます。

{{< figure src="/images/posts/try-tauri/counter.png" >}}

## Tauri の 実装パターンについて

Rust と JavaScript (TypeScript) でロジックを書くことができますが、どちらに処理を寄せるかなどは実装者が決めることができそうですが公式のドキュメントでいくつかの実装パターンが紹介されています。

以下のようなパターンが紹介されています。

- {{< exlink href="https://tauri.studio/docs/architecture/recipes/hermit" text="Hermit" >}}
- {{< exlink href="https://tauri.studio/docs/architecture/recipes/bridge" text="Bridge" >}}
- {{< exlink href="https://tauri.studio/docs/architecture/recipes/cloudish" text="Cloudish" >}}
- {{< exlink href="https://tauri.studio/docs/architecture/recipes/cloudbridge" text="Cloudbridge" >}}
- {{< exlink href="https://tauri.studio/docs/architecture/recipes/lockdown" text="Lockdown" >}}
- {{< exlink href="https://tauri.studio/docs/architecture/recipes/multiwin" text="Multiwin" >}}
- {{< exlink href="https://tauri.studio/docs/architecture/recipes/glui" text="GLUI" >}}

個人的には、できるだけロジックを Rust 側に持っていくのが良さそうかなーとなんとなく思っていますが、上記で言うと、Lockdown がそのアーキテクチャに当たりそうです。

## まとめ

今回は、Rust でコアの実装がされている Desktopアプリ開発のフレームワークである Tauri を簡単に触って試してみました。

Rust に慣れていれば、ロジックを Rust で書け、View 側とうまく分割できそうなので良さそうだなと思いました。
面白そうなプロダクトなのでいろいろ試してみようと思いました。
