+++
title="とても便利な Contentful Image API"
date="2020-05-31T18:51:23+09:00"
categories = ["engineering"]
tags = ["contentful", "api"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。


最近，Contentful という Headless CMS を使うことが多いのですが，その中でも画像系の Image API が特に便利なので紹介します．

## Contentful について

Contentful は Headless CMS です．Headless と言うとおりコンテンツの閲覧画面は用意しておらず，コンテンツを登録するための管理画面と，APIが用意されています．
https://www.contentful.com/

Contnetful は非常に拡張性が高く，コンテンツの管理用のAPIがあるので管理画面すら自前で作成できたり，すでにある管理画面を自由にカスタマイズできたりします．


## Image API

Contentful は画像も保存することができるのですが，画像にアクセスするために便利な Image APIが用意されています．

https://www.contentful.com/developers/docs/references/images-api/

### Basic

基本の画像取得方法は以下のとおりです．

`https://images.ctfassets.net/{space_id}/{asset_id}/{token}/{name}`

実際のサンプルとしては以下のような形になります．

```
https://images.ctfassets.net/yadj1kx9rmg0/wtrHxeu3zEoEce2MokCSi/cf6f68efdcf625fdc060607df0f3baef/quwowooybuqbl6ntboz3.jpg
```

ここでは深く言及しませんが，Contentful は利用方法として，Space をつくって，その中にコンテンツを保存し，そのコンテンツをAPIを通して取得する方式になります．

space_id が, 作成した space の ID で， asset_id は，登録した画像の ID, token は取得時の token で，name がファイル名です.
データを取得する CDA (Content Delivery API) 経由で で画像を取得する上記のようなAPI の URLを取得することができます．

次以降で Image API 便利な機能について紹介していきます．

### Format

画像のフォーマットを指定することができます．

クエリパラメータで，`{BASIC_URL}?fm={image_format}` と指定することで使用できます．

指定できるフォーマットは以下のとおりです．

- jpg
- png
- webp

つまり，登録した画像がpng などでも, `{BASIC_URL}?fm=jpg` などとすることで，jpg 画像として取得することができます．

また，Progressive JPEG や， 8-bit PNG にも対応しています．

Progressive JPEG は `{BASIC_URL}?fm=jpg&fl=progressive` とし，8-bit PNG は， `{BASIC_URL}?fm=png&fl=png8` とすることで，取得することができます．

任意のフォーマットで取得できるので大変便利です．

### Resize & Crop

Resize も簡単に行なえます．

`{BASIC_URL}?fit={type}&w={width}&h={height}`

type には，`pad`, `fill`, `scall`, `crop`, `thumb`  を指定することができます．

`pad` は 画像のアスペクト比をそのままにサイズを変換し，余白を任意の背景色で塗りつぶした画像を取得できます．
追加で，`&bg=rgb:ff0000` のようなパラメータを付加することで，背景色を指定できます．

`fill` は，画像のアスペクト比はそのままに，余白ができないように画像をスケールさせます．

`scale` は，アスペクト比を変更して画像をリサイズします．

`crop` は元画像のサイズのまま，指定したサイズで切り抜きます．

`thumb` は自動でサムネイル画像をつくってくれるもので，人物などが写っていたときに自動で顔を切り取ってくれたりするすごい機能です．

### Other

その他には，画像の角を丸くする `&r=20` のような指定や，画質設定の `q=90` といった指定などが用意されています．

詳しくは公式サイトを参照してみてください．

https://www.contentful.com/developers/docs/references/images-api/


## まとめ

今回は，Contentfulの Image API について簡単に紹介してみました．
Contentfulはその拡張性の高さだけではなく，豊富なAPIが用意されているため, ユーザー投稿方でない，一般的なWebアプリケーションであれば，Contnetfulを用いて作成することも可能だと思っています．

とくに画像系のAPIは充実しているので，ブログのような (ほぼ) Read Only のサービスを作成する際には良い候補になると思いました．

個人的におすすめです． (このブログは，Hugoですが)


