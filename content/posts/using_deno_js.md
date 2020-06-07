+++
title="新しいJSのランタイム Deno を触ってみる"
date="2020-06-06T16:23:58+09:00"
categories = ["engineering"]
tags = ["JavaScript", "js", "deno"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，JS の新しいランタイムである `Deno` を触ってみようと思います．

## 概要

公式サイトはこちらです．

https://deno.land/

マスコットの恐竜？がとても可愛いですね．

Installが shell で一発だったり，code formatter が公式で用意されてたり，最近の言語って感じでとても良さそうです．

deno は Rust で作られているそうなので，開発環境周りは Rust と同等のツールチェインが用意されてそうな気がします．

## 触ってみる
### Install

Install は コマンド一発でとても簡単です．Rust とかと同様の形式ですね.

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Installが完了したら，Instlal ディレクトリへのパスを通しておきます．
自分は，Ubuntu で， profile に 環境変数を記述する方式を取っていますが，`.bash_profile` や `.bashrc` などに以下のような記述をしておきます．

```
  export DENO_INSTALL="/home/kz_morita/.deno"
  export PATH="$DENO_INSTALL/bin:$PATH"
```

### 実行してみる

Deno の面白いところとして，URLを直接指定して実行できるという点があります．

公式サイトにあるとおり，以下のようにターミナル上で実行するとコードが実行されます．

```bash
$ deno run https://deno.land/std/examples/welcome.ts
> Welcome to Deno 🦕
```

恐竜かわいい！

https://deno.land/std/examples/welcome.ts


### サンプルコード

また，簡単なサーバーなら以下の公式サイトのサンプルによって立てることができます．

##### sample.ts
```js
import { serve } from "https://deno.land/std@0.55.0/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
```

これを実行しようと，以下のようなコマンドを実行すると，エラーになります．

```bash
$ deno run ./sample.ts

error: Uncaught PermissionDenied: network access to "0.0.0.0:8000", run again with the --allow-net flag
    at unwrapResponse ($deno$/ops/dispatch_json.ts:43:11)
    at Object.sendSync ($deno$/ops/dispatch_json.ts:72:10)
    at Object.listen ($deno$/ops/net.ts:51:10)
    at listen ($deno$/net.ts:152:22)
    at serve (https://deno.land/std@0.55.0/http/server.ts:252:20)
    at file:///path/to/your/workspace/sample.ts:3:11
```

ここも，`Deno` の面白いところだと思うのですが，[公式サイト](https://deno.land/)に，

> Secure by default. No file, network, or environment access, unless explicitly enabled.

とあるとおり，デフォルトではネットワーク (0.0.0.0:8000) にアクセスすることができずにエラーになります．
実行させるためには，以下のようにフラグを指定する必要があります．


```bash
$ deno run --allow-net ./sample.ts
> http://localhost:8000
```

これで，ローカルのサーバーを立ち上げることができます．ブラウザで，`localhost:8000` にアクセスすると，Hello World と表示されるのが確認できます．

しれっと，TypeScript で書きましたが，デフォルトで TypeScript をサポートしてたり，package.json や npm install といった作業が必要ないのは開発を始める際の障害が減るのではないかと期待しています．

import も，以下のように https://deno.land/std (Standard Library) や， https://deno.land/x (Third Party Library) といったURLをコード内に直接各形式でシンプルで良さそうです．

```js
import { serve } from "https://deno.land/std@0.55.0/http/server.ts";
```

## まとめ

今回は，Deno を簡単に触って遊んでみただけですが，後発なだけあってさすがに色々と改善や工夫がされているところが散見されて良さそうに思いました.
フロントエンド周りはちゃんと追いかけられていなくて，Deno が生まれた背景などちゃんとキャッチアップできてないのですが，既存のものに存在する課題への解決案が提示されていると思うので非常に勉強になるところが多そうです．

Runtime が Rust 製ということなので，なんとか時間を取ってコードを読んでみたいと思いました．


