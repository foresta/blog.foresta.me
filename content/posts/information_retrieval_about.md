+++
title="情報検索の概要について"
date="2020-10-25T23:18:12+09:00"
categories = ["engineering"]
tags = ["information_retrieval"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

情報検索の概要について学んだことをまとめます．

## 情報検索とは

情報検索の目的は，大規模なコレクションのなかから必要な情報を含むデータや文書を見つけることです．

見つけたいデータは，テキストや画像，音声など様々あります．（主にテキストの検索について語られれていることが多いと思います) \
テキストなどのように探したいデータは非構造的なものが多いため，どのように効率的に探すのかといったことが重要です．


情報検索の規模も，個人的な PC 内の検索といった比較的小さいものから，Web 検索といった膨大な量の文書の中から必要なデータを探すといったものがあり，その中間に各ドメインごとの検索といったものもあります．

## adhoc 検索

1回のクエリでユーザーがほしい文書，情報を検索して取得するものを adhoc 検索と呼びます．

ユーザーがクエリとして入力していないもので，それがユーザーに対して価値がある欲しい情報であれば，関連している文書として返すことも重要になっています．

## 論理検索モデル

Google 検索などでも採用されていると思いますが，検索したい用語を AND や OR や NOT で結合して検索できるものが 論理検索モデルです．

dog AND cat などと検索して，犬と猫が同時に現れる文書を検索するようなモデルになります．


## 検索の方法

検索の方法は様々ありますが，まず一番シンプルなのは線形に全探索することだと思います．いわゆる grep です．

こちらは，シンプルである程度の規模の文書のコレクションであれば効果的ですが以下のようなことは難しいです．

- 大規模のコレクションを高速に処理する
- より柔軟な検索クエリに対応する (たとえば，NEAR 検索 dog の近くに cat と書かれている文書 etc)
- 検索結果をランク付けする

これらを解決するために，文書をあらかじめインデックス付けをすることが重要です．

## 検索システムの評価

検索システムは，どれだけユーザーの要求する結果を返せるのかというところが評価対象になります．

評価指標としては以下の２つなどがあげられます．

- 適合率 (precision) : 返した文書のうちに価値あるものの割合
- 再現率 (recall) : 関連する全文書のうち検索システムが返した文書の割合

## まとめ

情報検索の概要についてざっくりまとめました．次はインデックス周りについてまとめていきたいと思います．

## 参考

* {{< exlink href="https://www.kyoritsu-pub.co.jp/bookdetail/9784320123229" text="情報検索の基礎" >}}
