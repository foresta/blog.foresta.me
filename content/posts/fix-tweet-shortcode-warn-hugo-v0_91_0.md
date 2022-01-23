+++
title="Hugo v0.89.0 以降の tweet shortcode で発生する warn を修正する"
date="2022-01-23T11:38:37+09:00"
categories = ["engineering"]
tags = ["hugo", "shortcode", "error", "warn"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Hugo の v0.91.0 で hugo build をしたところ以下のような warn が表示されました．

```
WARN 2022/01/23 11:21:55 The "tweet" shortcode will soon require two named parameters: user and id. See "/path/to/repository/blog.foresta.me/content/posts/self_made_keyboard.md:114:1"
```

以前までは tweet の id のみを指定すればよかったですが，以下の通り tweet shortcode に user と id の両方を指定する必要があるみたいです．
```
The "tweet" shortcode will soon require two named parameters: user and id.
```

一応このままでもビルドはできるのですが，warn が出ているのは気持ち悪いので修正したのでそのログです．

## 影響を受けるバージョン

上記の warn ログは，v0.89.0 で，twitter の oEmbed の endpoint が変更されたタイミングで表示されるようになったので，それ以降のバージョンはwarn ログが発生します．

```
v0.89.0
v0.89.1
v0.89.2
v0.89.3
v0.89.4
v0.90.0
v0.90.1
v0.91.0
v0.91.1
v0.91.2
v0.92.0
```

修正された commit は，以下になります．

- https://github.com/gohugoio/hugo/commit/0cc39af68232f1a4981aae2e72cf65da762b5768

## id と user の指定方法を確認

{{< exlink href="https://gohugo.io/content-management/shortcodes/#tweet" text="公式サイト" >}} にあるとおり，user と id を指定すれば ok です．

```
{{</* tweet user="kz_morita" id="1485072234322722816" */>}}
```

ソースコードをみる Named parameter が指定されていないときは以下のように id と user を取得します．

```
{{- $id := .Get 1 -}}
{{- $user := .Get 0 -}}
```

そのため以下のような指定でもOKです．
```
{{</* tweet user="kz_morita" id="1485072234322722816" */>}}
```

## まとめ

今回は，Hugo の tweet shortcode で発生する warn ログの修正についてまとめました．

warn ログなので修正しなくても，動きますがそのうち動かなくなる恐れがあるため早めに対応しておくのがよさそうです．
自分も全記事見直そうと思います．

{{< tweet user="kz_morita" id="1485072234322722816" >}}

