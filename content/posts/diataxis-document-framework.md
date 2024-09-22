+++
title="Diátaxis というドキュメントフレームワークについて"
date="2024-09-22T21:58:37+09:00"
categories = ["engineering"]
tags = ["document"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

社内のドキュメントについて色々と調べていたときに Diátaxis というフレームワークがあるのを知ったので紹介します。

## Diátaxis について

Diátaxis はテクニカルドキュメントのフレームワークです。

- {{< exlink href="https://diataxis.fr/" text="Diátaxis" >}}


以下の４つの構造からなります。

- TUTORIALS
- HOW-TO GUIDES
- REFERENCE
- EXPLANATION

### TUTORIALS

いわゆるチュートリアルです。
実際に手を動かして、学ぶコンテンツになります。
内容を詳細に説明するというよりは、説明したい対象を理解するために手を動かして学ぶ系のコンテンツです。

### HOW-TO GUIDES

ある特定の問題や、結果に向かっての手順などを示すものです。TUTORIALS が学習に重きをおいていたのに対し、HOW-TO GUIDES は目的指向です。

〇〇する方法といった形で、実現したい目標に対してどのように達成するかの手順を示します。
システムを使用するユーザー目線でのユースケースについて書かれます。

### REFERENCE

REFERENCE はシステムの技術的な説明と操作方法を記載します。

こちらは情報指向で、よくある API Reference などがこちらに当たります。
こちらが満たすべきこととしては、曖昧さがなく明確なことや、意見などを含まず中立的に書かれていることです。


### EXPLANATION

EXPLANATION は、システムの理解を深めるために記載されます。
システムについてより詳しく理解するために、談話的に書かれます。

ちなみに公式サイトには、

> (one could say, explanation is the only kind of documentation that it might make sense to read in the bath)

と書かれていて、お風呂の中で読むのに唯一価値があるものとありました。


## 使われ方

色々と書きましたが、普段ライブラリなどを使用するときにこれらのフォーマットはよく目にするものかとおもいます。

たとえば、{{< exlink href="https://ja.react.dev/learn" text="Reacct の learn ページ" >}} を見ると以下のようなコンテンツがあります。

- Learn
  - スタートガイド
    - クイックスタート
    - インストール
  - React を学ぶ
    - UI の記述
    - インタラクティビティの追加
    - state の管理
    - 避難ハッチ
- Reference
  - 概要
  - フック
  - コンポーネント
  - API

`スタートガイド` などは、まさに TUTORIALS の内容ですし、`React を学ぶ` は HOW-TO GUIDES に当たると思います。

`Reference` はまさに、REFERENCE の項目ですし、EXPLANATION については、 {{< exlink href="https://ja.react.dev/blog" text="React Blog" >}} という形で書かれているのかなと思います。

公式が、意識して書いているかどうかはわかりませんが私目線で上記のように分類できそうだなと思いました。


## 使い方

このフォーマットですが、チームのオンボーディングについて使えないかという点に現在興味があります。

たとえば、開発チームで使用するスキルについてそれを TUTORIALS 形式で書くことによってスキルをキャッチアップしてもらい、なにかタスクをこなす際に、 HOW-TO GUIDES のコンテンツを参照してもらいながら実装してもらう。

システムやAPIなどについての網羅的なドキュメントを用意しつつ、より深く理解するための EXPLANATION としてのドキュメントを用意するといった具合です。


メンテナンスするのが大変そうですが、新しく JOIN した人がある程度自力でオンボーディングできる仕組みにできないか考えています。


## まとめ

今回はテクニカルドキュメントの構造化フレームワークである Diátaxis について記載しました。
チームのドキュメントとして書いてみる試みはやってみたいなと思いました。
