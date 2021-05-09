+++
title="actix-web と sqlx を使おうとしてハマったこと"
date="2021-05-09T08:44:35+09:00"
categories = []
tags = []
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，RustでAPIサーバーを作っていて，DB まわりを diesel から sqlx に移行しようとしたときにすこしつまづいたことがあったのでそのことをまとめます．


## 先に結論

- sqlx と actix-web, actix-rt, tokio 周りの依存バージョンに注意する
- Cargo.toml で sqlx の fetures に runtime-actix-rustls など，rustls を使用すると，DSNにIPアドレスを利用できない
    -> native-tls を利用する


## 起こった問題

個人開発で，actix-web + diesel でAPIサーバーを作っていたのですが，sqlx が良さそうと聞いたのでそちらに移行することにしました．

- https://github.com/launchbadge/sqlx

特に深く考えず sqlx の最新バージョンを入れようと思い以下のような Cargo.toml を書いていたところ実行時にエラーがでてはまりました．

```
[dependencies]
actix-web = "3"
actix-rt = "^1.1.1"
sqlx = { version = "0.2", features = [ "runtime-actix-rustls", "mysql", "chrono" ] }
```


上記の状態でDBの接続周りのコードは以下のような感じです．

```rust
let database = env::var("MYSQL_DATABASE").expect("MYSQL_DATABASE is not set");
let user = env::var("MYSQL_USER").expect("MYSQL_USER is not set");
let password = env::var("MYSQL_PASSWORD").expect("MYSQL_PASSWORD is not set");
let port = env::var("MYSQL_PORT").unwrap_or("3306".to_string());
let host = env::var("MYSQL_HOST").unwrap_or("127.0.0.1".to_string());

// mysql://user:pass@127.0.0.1:3306/db_name
let database_url = format!(
    "mysql://{}:{}@{}:{}/{}",
    user, password, host, port, database
)

println!("{}", database_url);

let pool = sqlx::mysql::MySqlPoolOptions::new()
    .max_connections(20)
    .connect(&database_url)
    .await?;
```

### IP アドレスを指定したときに動かない

上記を実行しようとするとまず以下のエラーが出ました．

```
`Err` value: Tls(InvalidDNSNameError)
```

この問題は以下の Issue で話されていました．
- {{< exlink href="https://github.com/launchbadge/sqlx/issues/846" >}}

ここによると，ipaddress 部を `［］` で囲むと良いと書かれていて，試しましたがこちらはうまく行きませんでした．

```rust
let database_url = format!(
    "mysql://{}:{}@[{}]:{}/{}",
    user, password, host, port, database
)
```

以下のようなエラーが表示されました．

```rust
 `Err` value: Configuration(InvalidIpv6Address)'
```

IPv6 として認識されてしまうようでした．ipv4 のアドレスを，ipv6 に変換すれば上記でも動くかもしれないですが，今回はそれを試しませんでした．

同 issue 内で，sqlx の features に，rustls ではなく，native-tls を指定すればうまく動くとあり，こちらを試したところ正常に動作しました．

```
[dependencies]
actix-web = "3"
actix-rt = "^1.1.1"

# rustls => native-tls
sqlx = { version = "0.2", features = [ "runtime-actix-native-tls", "mysql", "chrono" ] }
```

## TokioのRuntimeが起動してないと怒られる

上記でDBへの接続はうまく行ったかのように思いましたが，つづけて以下のエラーが表示されました．

```
there is no reactor running, must be called from the context of a tokio 1.x runtime
```

actix が tokio を利用しているので，起動してないはずはないけどなぁと思いましたが，こちらは結論から言うと actix-web が要求する tokio のバージョンと，sqlx が要求する tokio のバージョンが異なっていたことが原因でした．

エラーになるときの，Cargo.toml が以下です．

```
[dependencies]
actix-web = "3"
actix-rt = "^1.1.1"
sqlx = { version = "0.5", features = [ "runtime-actix-native-tls", "mysql", "chrono" ] }
```

バージョンの違いは以下のような感じです．

```
sqlx の 0.5.2 使おうとする
- 要求する tokio のバージョンが，^1.0.1

actix-web 3.3.2 を使っている
- 要求する actix-rt が ^1.1.1
    - actix-rt ^1.1.1 の要求する tokio が ^0.2.6

sqlx の 0.4.2 を使えばOK
- 要求する tokio が ^0.2.21
```

sqlx を 0.4 系を使うようにすると正常に動きました．

```
[dependencies]
actix-web = "3"
actix-rt = "^1.1.1"

# 0.5 => 0.4
sqlx = { version = "0.4", features = [ "runtime-actix-native-tls", "mysql", "chrono" ] }
```

各 crate が依存している crate のバージョンを調べるには，crate.io を見ればわかります．

sqlx であれば，{{< exlink href="https://crates.io/crates/sqlx" >}} を開いて，dependencies タブを開くと以下のように依存している crate を確認できます．

{{< figure src="/images/posts/rust-sqlx-actix/crate.io.png" >}}

## まとめ

今回は，actix-web と sqlx を使う際につまづいたエラーについてまとめました．

とくに crate 間の依存バージョンについては，どの crate を使うにしても気にすべき点なので注意が必要だなと思いました．

ざっくり使った感じ sqlx 便利そうなのでいろいろ試していきます．
