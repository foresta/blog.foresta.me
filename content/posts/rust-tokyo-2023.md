+++
title="Rust.Tokyo 2023 にオンライン参加してきました"
date="2023-10-22T08:09:39+09:00"
categories = ["engineering"]
tags = ["rust", "勉強会"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Rust.Tokyo 2023 にオンラインで参加してきたのでレポートです。


## Rust.Tokyo 2023 について


- {{< exlink href="https://rust.tokyo/2023" >}}

今回の Rust.Tokyo は 10/21 に開催され、オフラインとオンラインの両開催でした。

オフライン参加したかったですが、チケット売り切れていたのでオフラインで参加しました。

オンライン開催は、YouTube 視聴だったのですがアーカイブ動画でたらリンク貼ろうかと思います。

## LINEUP と感想

発表された内容と感想をざっくり書いてみます。

### IoTプラットフォーム開発におけるRustの活用

{{< exlink href="https://rust.tokyo/2023/lineup/1" text="IoTプラットフォーム開発におけるRustの活用" >}}

発表資料
: https://docs.google.com/presentation/d/1Qqb5-7xNPzREMDEuj8d_tzMGRPIjYIWaJm1aEK9fP7g/edit

IoT のエッジデバイス側や、API 側で Rust 使われている話でした。

Rust のエコシステムと最近の流れが説明されていて、例えば、

- async / await の導入
- エラーハンドリングが failure => anyhow/thiserror
- サードパーティライブラリの変遷

など最近の Rust の環境について改めてしれてよかったです。

### かにさんタワーバトル

{{< exlink href="https://rust.tokyo/2023/lineup/2" text="かにさんタワーバトル" >}}

発表資料
: https://speakerdeck.com/sadnessojisan/kanisantawabatoru

Axum と、それに使われている Tower, Hyper についての発表でした。

この発表では、Live Reading というコードリーディングを Live でやる試みがされていて、これがすごく良いなと思いました。

普通に、業務とかでも OSS ライブリーディング会とかやったら楽しそうだなと。

発表内容も、Axum と Tower、 Hyper の関係性を深掘りしていくような内容で面白かったです。


### 他言語がメインの場合のRustの活用法 - csbindgenによるC# x Rust FFI実践事例

{{< exlink href="https://rust.tokyo/2023/lineup/3" text="他言語がメインの場合のRustの活用法 - csbindgenによるC# x Rust FFI実践事例" >}}

こちらは、C# をメインで使用している会社さんが、Rust の FFI を使って、C# から Rust や、C++ などのコードを利用する点について発表されていました。

C# は新卒で初めて触れた言語でソーシャルゲームを作っていたのでちょっと親近感も湧きつつ、C# を第一言語、Rust を第二言語としながらどんどん必要な OSS を開発されているのがすごいなと率直に思いました。

### 素材メーカーが内製開発でRustを使っている話

こちらはスポンサーセッションでした。（自分がちょっと移動してたこともあってあまり聞けなかったです。）

内容としては、Rust 未経験者がほとんどの中採用して 社内で使っているという話でした。

Rust を使うと困りがちな、build 高速化の Tips や、社内へどのように布教するかという話は現場感があって面白かったです。

特に、Rust の本をいっぱい買って、流行ってるんだぞ感をまわりに植え付けるみたいな話はなるほどと思いました。(効果ありそう)


### Rustがユニークビジョンにもたらした恩恵と苦労　～そしてお返しへ～

こちらもスポンサーセッションです。

Twitter API をヘビーに利用されている会社さんで Rust 周りを採用したお話でした。

Rust で API 開発したモチベーションが、大量のアクセスをできるだけ早くさばきたいからというモチベーションがあったと発表内でありました。
Rust 使うと、高速で大量アクセス捌けるといった話はなんとなくそうなんだろうなーレベルで感じてましたが、実際に採用されてそれで要求されるアクセスパターンをさばけているといった話を聞くのは面白かったです。

### 並行キャッシュライブラリの開発で得られた知見

{{< exlink href="https://rust.tokyo/2023/lineup/4" text="並行キャッシュライブラリの開発で得られた知見" >}}

こちらは、Rust の インメモリキャッシュライブラリである Moka についてのお話でした。

- {{< exlink href="https://github.com/moka-rs/moka" >}}

{{< exlink href="https://github.com/ben-manes/caffeine" text="Caffeine" >}} というキャッシュライブラリから着想をえたものらしく、元々 Caffeine ユーザーだったので気になります。

発表中、TinyLFU というキャッシュポリシーの話や、Lock-free の排他制御の話とかレイヤーが低めで面白い話がたくさんあって良かったです。
非同期のキャンセルの話など、このあたりとても面白そうなので学んでみようと思える楽しい発表でした。

### Rust 業務経験がない開発者で集まって汎用ツールを開発した話

{{< exlink href="https://rust.tokyo/2023/lineup/5" text="Rust 業務経験がない開発者で集まって汎用ツールを開発した話" >}}

Chatwork 社さんで、Rust を採用して Roggol という汎用ツールを開発された話でした。

ES + CQRS という構成で、RMU (Read Model Updater) を汎用的に実装するというものでした。

Rust を運用してみて、コンテナのイメージサイズが小さいことや、メトリクスの安定感など Rust のメリットがたくさんあったという話が聞けました。

unwrap 良くないとか、動的に決めたい仕組みへの対応などこのあたりの Tips はかなり参考になった気がします。


### Ferrocene - Enabling Rust in Critical Environments

{{< exlink href="https://rust.tokyo/2023/lineup/6" text="Ferrocene - Enabling Rust in Critical Environments" >}}

こちらは、英語セッションで自分はあまり聞き取れませんでした。(英語力。。。)


内容としては、Ferrocene という Rust で mission critical な開発をするために、安全性が認定された Rust ツールチェーンの開発などの話でした。

- {{< exlink href="https://github.com/ferrocene" >}}

Rust の利用範囲が、自動車、航空、宇宙などかなり多岐にわたることを改めて知りました。
また、この地道ともいえる壮大な作業をやられているということに素直にすごいプロジェクトだと感動しました。



## 最後に

今回は、オンライン参加でしたがかなり充実した内容で楽しかったです。

オフライン組の方々とても楽しそうだったので、次回もしあればオフラインでの参加したいなと思いました。

Rust 熱が再燃してきてよかったです。
