+++
title="Shuttle で Rust のアプリケーションをデプロイしてみる"
date="2024-02-11T13:33:14+09:00"
categories = ["engineering"]
tags = ["rust", "shuttle"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Rust のアプリケーションをデプロイできるプラットフォームである、{{< exlink href="https://www.shuttle.rs/" text="Shuttle" >}} というサービスが気になっているので触ってみます。

- {{< exlink href="https://www.shuttle.rs/" >}}

## 無料でどこまで使えるか？

{{< exlink href="https://www.shuttle.rs/pricing" text="Pricing" >}} ページをみると以下のことは無料で可能そうです。

- 1 ユーザーまで
- 3 プロジェクトまでデプロイ可能
- DB Size 1 GB まで
- Log の保持 1 日まで
- Network (egress) 1GB まで
- 1 日 20 デプロイまで
- 1 デプロイ 10分まで

サンプルやちょっとしたアプリケーションのデプロイでは十分遊べそうです。

Pro プランになると、1 ユーザーあたり 月 $20 ( + リソースのUsageによる従量課金) で使うことができそうです。

## Shuttle の Setup

まずは、ログインする必要があります。GitHub のアカウントでログインが可能です。

- {{< exlink href="https://console.shuttle.rs/login" >}}

ログインするとダッシュボードのような画面が表示されます。

表示に従い、Setup をすすめます。

{{< exlink href="https://docs.shuttle.rs/getting-started/installation" text="こちらのドキュメント" >}} も参考にしました。

```bash
$ cargo install cargo-shuttle
```

自分の環境だと、`clap_mangen` という package のビルドに rustc のバージョンが低かったようでエラーが出ました。 
```
error: failed to compile `cargo-shuttle v0.38.0`, intermediate artifacts can be found at `/tmp/cargo-installBAhEdS`.
To reuse those artifacts with a future compilation, set the environment variable `CARGO_TARGET_DIR` to that path.

Caused by:
  package `clap_mangen v0.2.20` cannot be built because it requires rustc 1.74 or newer, while the currently active rustc version is 1.72.1
  Try re-running cargo install with `--locked`
```

いい機会なので rustc のアップデートもやろうかなと思います。

```bash
$ rustup update

$ rustc --version
rustc 1.76.0 (07dca489a 2024-02-04)
```

アップデートできたので再度インストールしたら無事インストールできました。

```bash
$ cargo install cargo-shuttle
```

以下のコマンドを打つと API key を求められるので、ログイン後のダッシュボード画面のようなところからコピーして入力します。

```bash
$ cargo shuttle login
```

ちなみにこの API Key は、`~/.config/shuttle/config.toml` に記載されていました。デプロイなどの際にここを見に行ってるのだと思います。

## プロジェクト生成

- {{< exlink href="https://docs.shuttle.rs/getting-started/quick-start" >}}

次にプロジェクトの生成などを行います。
対話式の I / F で聞かれるので答えていきます。

```
$ cargo shuttle init
 $ cargo shuttle init
What do you want to name your project?
It will be hosted at ${project_name}.shuttleapp.rs, so choose something unique!
✔ Project name · shuttle-sample-app

Where should we create this project?
✔ Directory · {your project directory}

Shuttle works with a range of web frameworks. Which one do you want to use?
✔ Framework · axum

Creating project "shuttle-sample-app" in "{your project directory}"

Hint: Check the examples repo for a full list of templates:
      https://github.com/shuttle-hq/shuttle-examples
Hint: You can also use `cargo shuttle init --from` to clone templates.
      See https://docs.shuttle.rs/getting-started/shuttle-commands
      or run `cargo shuttle init --help`

✔ Claim the project name "shuttle-sample-app" by starting a project container on Shuttle? · yes

Project "shuttle-sample-app" is ready
Your project will sleep if it is idle for 30 minutes.
To change the idle time refer to the docs: https://docs.shuttle.rs/getting-started/idle-projects

Run `cargo shuttle deploy --allow-dirty` to deploy your Shuttle service.
Run `cargo shuttle run` to run the app locally.
```

上記を実行すると以下のような状態になりました。

```
$ tree . -L 2
.
├── Cargo.lock
├── Cargo.toml
├── src
│   └── main.rs
└── target
    ├── CACHEDIR.TAG
    └── debug/

3 directories, 4 files
```

main.rs の中身は以下のようになっていました。

```rs
use axum::{routing::get, Router};

async fn hello_world() -> &'static str {
    "Hello, world!"
}

#[shuttle_runtime::main]
async fn main() -> shuttle_axum::ShuttleAxum {
    let router = Router::new().route("/", get(hello_world));

    Ok(router.into())
}
```

Framework に axum を選んだので基本的なセットアップ内容と、shuttle 用の attribute macro の `shuttle_runtime::main` と `ShuttleAxum` というもので初期化された main 関数があることが確認できます。

## 実行とデプロイ

以下コマンドで、ローカルで実行できます。

```bash
$ cargo shuttle run
```

無事実行できると、`localhost:8000` で Hello, world! が返ってくることが確認できます。

続けて、以下コマンドでデプロイすることができます。

```bash
$ cargo shuttle deploy --allow-dirty
```


デプロイコマンドを実行すると、ダッシュボード画面にも反映されていることが確認できます。

{{< figure src="/images/posts/try-shuttle-for-rust/shuttle-deploy.png" >}}

Deploy が終わると実際に URI にリクエストして確認することができます。

自分の場合は以下のような URI でした。
```
https://shuttle-sample-app.shuttleapp.rs
```

(Project名がそのままサブドメインになっているので、project 名は重複禁止もしくは連番みたいな仕組みで URL になるのかも)



アプリケーションを止めたいときは、以下コマンドもしくはダッシュボードから行えます。

```
$ cargo shuttle stop
```

## Resource について

shuttle では、Database として、以下に対応されています。

- Shuttle AWS RDS
- Shuttle Shared Databases
- Shuttle Persist
- Shuttle Turso
- Shuttle Qdrant

Shuttle AWS RDS は、プロジェクトごとの専用インスタンスで RDS を使用できます。

対して Shuttle Shared Databases は、ユーザー間で共通の DB となるみたいです。ほかユーザーのDBにアクセスはできないものの共有インスタンスとなります。

Shuttle Persist は、`serde::Serialize`, `serde::Deserialize` を実装したデータをファイルシステム上の KVS に永続化することができる仕組みです。

Shuttle Turso は、SQLite のフォークである、libSQL をベースにしたエッジホスト型の分散データベースです。

Shuttle Qdrant は、ベクトルDB の Qdrant に接続できるようになります。

色々な DB へのアダプターが用意されていてかなりすごいなと。

さらにすごいのが 実際の接続方法の簡単さです。実装者がやることとしては annotation を追加するだけのようです。

GitHub にサンプルコードがあるのでそこから引用しますが、Shared Databases の PostgreSQL を使用する場合以下のようなシンプルな記述で使用可能です。


- {{< exlink href="https://github.com/shuttle-hq/shuttle-examples/blob/cf41bff484abd4a8624fda1b6f95ef8ebd568af5/axum/postgres/src/main.rs#L45-L59" text="github.com/shuttle-hq/shuttle-examples/axum/postgres/src/main.rs" >}}
```rs
#[shuttle_runtime::main]
async fn axum(#[shuttle_shared_db::Postgres] pool: PgPool) -> shuttle_axum::ShuttleAxum {
    sqlx::migrate!()
        .run(&pool)
        .await
        .map_err(CustomError::new)?;

    let state = MyState { pool };
    let router = Router::new()
        .route("/todos", post(add))

        .route("/todos/:id", get(retrieve))
        .with_state(state);

    Ok(router.into())
}
```

annotation を書くだけで DB を使用できるの非常に便利そうだなと思いました。


## まとめ

今回は、shuttle という rust のサーバーレスプラットフォームを触ってみました。かなり便利だったのでちょっとしたアプリケーションをデプロイする際など便利そうです。
プロトタイピング目的などであれば、非常に有用だなと思いました。
