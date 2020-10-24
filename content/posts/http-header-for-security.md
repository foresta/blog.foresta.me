+++
title="セキュリティ関連の HTTP Header まとめ"
date="2020-10-23T19:27:42+09:00"
categories = ["engineering"]
tags = ["http", "security"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です.

Webサービスを作る上で考慮しなければいけないもののひとつとしてセキュリティがあげられます．
今回は，セキュリティ周りの HTTP Header についてまとめます．

## X-Frame-Options


HTTP Response Header で，X-Frame-Options をつけると他のページ上の iframe から読み込まれることを許可するかどうかを指定できます．

DENY か，SAMEORIGIN を指定することが出来ます．

```
X-Frame-Options: DENY | SAMEORIGIN
```

このヘッダはクリックジャッキング攻撃を防ぐ目的で使用することができます．

#### 参考
* {{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-Frame-Options" text="X-Frame-Options" >}}

## X-Content-Type-Options

HTTP Response Header で, X-Content-Type-Options を指定すると，MIME スニッフィングを抑制することが出来ます．MIME スニッフィングとは，ブラウザーがリソースの MIME タイプが誤って設定されていると判断したときに，自動でリソースを確認して，正しい MIME タイプを推測することです．

このスニッフィングを抑制することで XSS を使った攻撃のリスクを減らすことが出来ます．

`nosniff` を指定することが出来ます．
```
X-Content-Type-Options: nosniff
```

#### 参考
* {{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-Content-Type-Options" text="X-Content-Type-Options" >}}
* {{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Basics_of_HTTP/MIME_types" text="MIME タイプ" >}}

## Strict-Transport-Security

いわゆる HSTS というやつです．\
HTTP Strict Transport Security を利用し，HTTP Response Header をすることで，ブラウザに対して HTTP から HTTPS に自動的に変換する必要があることを通知することができます．
max-age が必須で，includeSubDomains と preload が Optional な項目です．

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

includeSubDomains を指定すると，すべてのサブドメインにも適用されます． preload を指定すると Googleが提供している {{< exlink href="https://hstspreload.org/" text="HSTS先読みサービス" >}} を使用して，主要ブラウザーで HTTP の通信を行わないようにすることができます．

#### 参考
* {{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Strict-Transport-Security" text="Strict-Transport-Security" >}}
* {{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Strict-Transport-Security#Preloading_Strict_Transport_Security" text="Strict Transport Security のプリロード" >}}
* {{< exlink href="https://developer.mozilla.org/ja/docs/Glossary/HSTS" text="HSTS" >}}

## X-XSS-Protection

HTTP Response Header で, X-XSS-Protection を指定すると, 反射型の XSS を検出したときにページの読み込みを停止します．反射型の XSS は，ユーザーからのリクエストに入っているスクリプトを，Response の HTML で出力してしまうことによる XSS になります．

この Response Header の対応ブラウザは，IE , Chrome , Safari になります．
後述する `Content-Security-Policy` で，`unsafe-inline` を指定すれば基本的には大丈夫らしいですが，CSPに対応していない古いブラウザーに対しては有効なようです．


#### 参考

* {{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-XSS-Protection" text="X-XSS-Protection" >}}
* {{< exlink href="https://www.ipa.go.jp/files/000024726.pdf" text="「クロスサイトスクリプティング（XSS）」の脆弱性の種類 (PDF)" >}}

## Content-Security-Policy

コンテンツセキュリティポリシー (CSP) は，XSSなどの攻撃を検知して，影響を軽減するための HTTP Response header になります．

基本的には，ディレクティブを複数指定することができます．
```
Content-Security-Policy: directive-name value; directive-name value; ...
```

ディレクティブには大きく分けて，`フェッチディレクティブ`, `文書ディレクティブ`, `ナビゲーションディレクティブ`, `報告ディレクティブ`, とその他いくつかのディレクティブがあります．

フェッチディレクティブ
: ソース種別ごとに，ロードされうる場所を制御することができます．


文書ディレクティブ
: 文書もしくは，Worker 環境についてのプロパティを管理します．

ナビゲーションディレクティブ
: ユーザーの遷移についてや，フォームを送信する場所の管理を行います.

報告ディレクティブ
: 上記３つとは若干異なり，ポリシー違反した際にどのように報告をするかというフローを指定します．

以下にフェッチディレクティブの例をいくつか紹介します．

| ディレクティブ | 説明 |
|-----|-----|
| frame-src | `<frame>` や，`<iframe>` などによって読み込まれるコンテンツのソースを制御します |
| script-src | JavaScript に対する有効なソースを指定します |
| img-src | 画像や favicon などに対する有効なソースを指定します |
| etc... | |

一部のみを引用しているので，詳しくは，{{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Security-Policy" text="Content-Security-Policy - HTTP | MDN">}} を参照してください．


#### 参考
* {{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/CSP" text="コンテンツセキュリティポリシー(CSP)" >}}
* {{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Security-Policy" text="Content-Security-Policy" >}}

## まとめ

セキュリティ周りの HTTP Header をまとめました．セキュリティまわり考慮することが多くやるべきことが多いですが，できるかぎり対応して堅牢なサービスを心がけていきたいです．

MDN とても充実しているので一度目を通すのがよさそうです．

- https://developer.mozilla.org/ja/docs/Web

