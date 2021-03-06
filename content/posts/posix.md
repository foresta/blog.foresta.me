+++
title="POSIXとシステムコールについて"
date="2021-04-11T22:00:10+09:00"
categories = ["engineering"]
tags = ["os", "linux"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，OS自作本の中で触れられていた POSIX とシステムコールについて調べたことをまとめます．

## POSIX とは

POSIX（Portable Operating System Interface）は，OSの上で動くアプリケーション開発をする際に，UNIX系のOSが共通して持つべき API について定めた規格で，IEEEが定めています．

その内容は，以下のようなもので構成されています．

- システムコール
- プロセス環境
- ファイルとディレクトリ
- システムデータベース
- アーカイブフォーマット


POSIXに規定された機能のみで書いたプログラムであれば，POSIX に準拠したOSでは動作が保証されることを意味し，アプリケーションの移植性を用意にするために作成されました．

## システムコールとは

OS はメモリやHDDなどの，コンピュータの資源を管理して，アプリケーションが動作する環境を提供するソフトウェアですが，このソフトウェアのことを `カーネル` と呼ぶことがあります．

このカーネルへプログラムからアクセスのインターフェースが，`システムコール` と呼ばれるソフトウェアの層になります．

このシステムコールは主に，ライブラリ関数や，シェルから呼ばれることが多いですがアプリケーションから直接呼ぶことも出来ます．

## ライブラリ関数とシステムコール

C言語などで誰しもが最初に書くであろう，Hello World と表示するために `printf` といった関数を使用すると思いますがこれはライブラリ関数で，実際に中では `write` というシステムコールが呼ばれています．

メモリ関係では，`malloc` などが一般的ですが，こちらもライブラリ関数で中で `sbrk (2)` というシステムコールが呼ばれています．

ユーザーが書いたプログラムから，`printf` や `malloc` といったライブラリ関数が呼ばれ，その中身で，カーネルへのインターフェースであるシステムコール (`write` や `sbrk`) をといった構造になっています．

また，アプリケーションから直接起動することが多いシステムコールとして，`fork` や `exec` ，`waitpid` などもあります．

## まとめ

今回は POSIX についてと，システムコール について簡単にまとめました．

OS 自作本の中では，OS開発者側の目線で POSIX などについて記載がありましたが，通常はアプリケーションを書く側として POSIX を意識することがほとんどだと思います．

このあたりの話は，まだ色々調べ中で理解しきれてないので引き続き深ぼっていきたいと思います．


