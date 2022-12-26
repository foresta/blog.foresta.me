+++
title="OpenAPI 仕様で書かれた API ドキュメントをWebページとしてみる"
date="2022-12-26T22:15:20+09:00"
categories = ["engineering"]
tags = ["openapi"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段、openapi 形式の yaml ファイルで API 仕様書を管理していますが、それを見やすい形にドキュメントする方法について書きます。

普段は、openapi 仕様形式の yaml を {{< exlink href="https://stoplight.io/studio" text="Stoplight Studio" >}} を使って編集しています。
その yaml ファイルから generator を使って、API が返すモデルを自動生成しています。

Stoplight Studio でも見れますが、編集用ということもあり若干見にくいのとどこかのサーバーにホスティングできないかと調べたところ方法があったのでメモです。

## HTML でAPI ドキュメントを表示する

結論からいうと、以下のような HTML を書くと API ドキュメントを Web ページとして見ることができます。

```html
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title>API Docs</title>
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link
      rel="stylesheet"
      href="https://unpkg.com/@stoplight/elements/styles.min.css"
    />
  </head>
  <body>
    <elements-api apiDescriptionUrl="openapi.yml" router="hash" />
  </body>
</html>
```

詳しくはこちらの {{< exlink href="https://docs.stoplight.io/docs/elements/a71d7fcfefcd6-elements-in-html" text="公式ドキュメント" >}} にも記載があります。

HTML ファイルなのであとは、S3 や GitHub Pages など何らかの方法でホスティングすることで API ドキュメントを見ることができるようになります。
公式のドキュメントを見る限り、React や GatsbyJS、Angular なども対応しているそうです。

上記の例では、`elements-api` コンポーネントの `apiDescriptionUrl` に yml ファイルのパスを渡していますが、`apiDescriptionDocument` という変数に直接 yaml や JSON 文字列を渡すことも可能です。

その他にも色々といじれる設定があるみたいなので詳細は以下を参照してみてください。

- {{< exlink href="https://docs.stoplight.io/docs/elements/b074dc47b2826-elements-configuration-options" >}}

## まとめ

今回は、openapi 仕様の API ドキュメントを Webページで見る方法をメモしました。

仕様に基づいて、コードの自動生成ができたりドキュメント化が簡単にできたりとても便利なエコシステムなので新たに API など作る際はとりあえず入れておくと良さそうです。
