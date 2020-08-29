+++
title="RustのLT会 Shinjuku.rs #11 @オンライン の参加レポート"
date="2020-08-29T23:53:57+09:00"
categories = ["engineering"]
tags = ["report", "rust"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

久しぶりに，オンラインの勉強会にブログ枠で参加したのでレポートを書いていきます．

参加したイベントはこちら

{{< exlink text="RustのLT会 Shinjuku.rs #11 @オンライン" href="https://forcia.connpass.com/event/182303/" >}}

ハッシュタグ: {{< exlink text="#Shinjukurs" href="https://twitter.com/hashtag/shinjukurs" >}}

## Rustでソートを高速化した話 @tempura0224（フォルシア）

こちら，参加が遅れてしまいほとんど聴き逃してしまいました．(すみません．．．)

内容としては，$O(nlogn)$ でソートしていたところを， partial_sort にして，$O(n)$ ( たしか $O(n + klogn)$ ) に高速化したというお話でした．\
あとは，両者の実行結果をグラフ化して，表示されていてHTMLレポートとしても出力がされていました．

ベンチマークツールに Criterion を使っていた模様です．

## みなさま Rust のライブラリをベンチマークです。お教えしましょう！ @ngtkanaさん


資料はこちら

- {{< exlink href="https://drive.google.com/file/d/1ujvhn00mrwHfLZVQlbbNF1Hev2HiIQY-/view" >}}

Rust のベンチマークツールについて，紹介されていました．

Crate criterion がベンチマークツールとして良さそうでした．Rust の stable でも動くのと，グラフもかけるのが特徴的です．

{{< exlink href="https://github.com/bheisler/criterion.rs" >}}

もう一つ紹介されていた，{{< exlink href="https://github.com/flamegraph-rs/flamegraph" >}} もよさそうで，その名の通り，framegraph を描画できるライブラリのようです．\
framegraph は，CPUプロファイリング結果を可視化したグラフで，どの処理がボトルネックになっているかの分析をすることができるものです．


個人的には，ベンチマーク結果をグラフ化できるのが良さそうなので，Criterion を触ってみようと思います．

ベンチマークツールの特徴の比較と実際の仕様例を紹介されていてため，非常にためになりました．

## Rust をWeb Assembly ビルドしてクロスプラットフォームなライブラリをつくる @\_tkato\_さん

資料はこちら

- {{< exlink href="https://docs.google.com/presentation/d/1kwY-gG9pPnLkATgFbDYin_mOnuFxHwrUcCFA0aQLf-U/edit#slide=id.p1" >}}

マルチプラットフォーム向けのライブラリを Rust で開発したいという需要があり，その際にライブラリのフォーマットとして，wasm を利用するといった話でした．

Web Assembly は，なんとなく聞いたことがあってブラウザ上でバイナリを動かすといった認識でしたが，たしかに各種環境が wasm をサポートしていれば各プラットフォーム向けのビルドをする必要がなくなるのは良さそうに感じました．

ベンチマーク結果として，Native よりも数倍 wasm が遅いようでしたが，そこまで厳密にパフォーマンスが求められないようなユースケースではかなり良さそうな手法に思います．

## 俺のVecにはlower_boundがついてるけど、お前は？ @宇宙ツイッタラーXさん

こちら資料はなく，すべてライブコーディングでした．ライブコーディングだったので，すごく理解が難しいかなと思いきや，とてもわかりやすい説明をされていました．(すごかった．．．)

内容としては，Vec に対して，LowerBound トレイトを定義して使えるようにし，macro を用いて各 Type の Vec に対して，実装していく内容でした．


具体的には，以下のように，複数の型に対してTrait を実装するのは大変なので，macro 用いて実装するといった内容です．

```rs
trait LowerBound {
    // ...
}

impl LowerBound for Vec<i32> {
    // ...
}

impl LowerBound for Vec<i64> {
    // ...
}

impl LowerBound for Vec<u32> {
    // ...
}

impl LowerBound for Vec<u64> {
    // ...
}
```

ライブコーディングで実際のコードを見ながら，Vec に lower_bound メソッドを生やす過程がみれて非常に勉強になりました．

## RustによるRuby処理系の実装 @monochromeさん

資料はこちら

- {{< exlink href="https://docs.google.com/presentation/d/1RFJvhJRhK18l_Qe-k3nju-TxOmwKtAxXa6q05ca-UzY/edit" >}}


Ruruby という，Rust で実装された Ruby の言語処理系の実装についてお話されていました．

{{< exlink href="https://github.com/sisshiki1969/ruruby" >}}


parser や, VM も Rust で実装されていて，2万行くらいとのことで，純粋にすごいと感じました．

発表の中で，Ruby の Syntax を AST に parse するのがつらいというお話が出ていて，これは確かに骨が折れそうと思いました．

具体例は以下のページで紹介されていました．

{{< exlink href="https://docs.google.com/presentation/d/1RFJvhJRhK18l_Qe-k3nju-TxOmwKtAxXa6q05ca-UzY/edit#slide=id.g94717b43cf_0_46">}}


言語処理系，興味はあるもののなかなか取り組めていなかったのですごく刺激になる発表でした．

## 感想

Rust の LT 会には久しぶりに参加したのですが非常に楽しかったです．Rustという言語の特性上なのか，アルゴリズムや，言語処理系などといったテーマが扱われることが多く，自分が興味がある分野の話題が多く話されていてとてもおもしろかったです．

また，LT 会の中で ダイレクトマーケティング (？) されていた，`『実践 Rust プログラミング 入門』` の本ですが，自分も購入したのでこれから読み進めていきます．

<a href="https://www.amazon.co.jp/dp/4798061700" target="_blank"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=4798061700&Format=_SL160_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=foresta04-22&language=ja_JP" ></a><img src="https://ir-jp.amazon-adsystem.com/e/ir?t=foresta04-22&language=ja_JP&l=li2&o=9&a=4798061700" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

{{< exlink href="https://www.amazon.co.jp/dp/4798061700" text="実践 Rust プログラミング 入門" >}}

発表の中で，キャッチアップしきれていない内容などもあったので，上記の本でしっかり入門していこうと思いました．

運営の方，発表者の方，参加された皆様お疲れ様でしたー．


