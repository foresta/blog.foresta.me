+++
title="システム設計の学習に System Design Primer がかなり良さそう"
date="2024-11-10T14:47:28+09:00"
categories = ["engineering"]
tags = ["system-design", "learning"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

ソフトウェア開発で必要なシステム設計のスキルを学ぶのに良さそうな学習リソースとして、System Design Primer という GitHub リポジトリがあります。
ざっと目を通した感じかなり良さそうだったので紹介します。

## The System Design Primer

{{< exlink href="https://github.com/donnemartin/system-design-primer" text="system-design-primer">}} という GitHub リポジトリにシステム設計の学習に役立つ情報がまとめられています。

こちら日本語版もあります。

{{< exlink href="https://github.com/donnemartin/system-design-primer/blob/master/README-ja.md" text="システム設計入門">}}

内容としては、システム設計についての知識やコーディング面接でシステム設計を問われた時の考え方などが記載されています。

トピックとしては以下のようなものがあります。

- パフォーマンス、スケーラビリティ、レイテンシー、スループットなど
- CAP理論について
- 一貫性のパターン
- レプリケーションやフェイルオーバーなど
- キャッシュについて
- DB, Application などレイヤーごとの設計

他にも、システム設計の面接問題の例題が記載されています。

たとえば、以下のような問題があります。

- Dropbox のようなファイル同期サービスを設計する
- Twitter のトレンド機能の設計

実際のサービスの設計について考えるための参考になるリンクなどを記載されていてかなり良さそうです。

他にも、有名企業の TechBlog などのリンクも記載されています。
全体的にこれらの企業に面接を挑むためのドキュメントとして書かれていますが、そうでない場合でも非常に有用な知識が得られると思います。

## まとめ

今回 System Design Primer という GitHub リポジトリを紹介しました。全然読めてないのですがこちらかなり良さそうなので読み進めようと思います。
