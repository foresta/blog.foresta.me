+++
date = "2019-03-31"
title = "ブログ執筆を支える技術というタイトルでLTをしてきた話"
tags = ["LT", "ブログ"]
categories = ["engineering"]
+++

## はじめに

「ブログ執筆を支える技術」というタイトルでLTをしてきましたので、その感想だったり補足だったりをしていこうと思います。\

参加したのはこちらのイベントです。\
[なんでもLT大会 第3弾](https://itmokumoku.connpass.com/event/119460/)

## 内容について

主にHugoについての補足を簡単にしていこうかと思います。

スライドはこちら

<iframe src="//www.slideshare.net/slideshow/embed_code/key/4d8NLyYXqO0lql" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe>


ちなみに、表紙を作るのが一番時間がかかったりしました。


大まかに説明すると以下のような内容です。

* 週一でブログを書いている
* 書かざるを得ない環境をつくるの大事
* 快適な執筆環境を自力で構築した
* 車輪の再開発は贅沢

### Hugo について

このサイトはHugoという静的サイトジェネレータを用いているので、それについて簡単に説明します。

https://gohugo.io/

#### インストール

基本的にOSXの方であれば、Homebrewを用いて一発でインストールできます。

```
brew install hugo
```

#### サイト作成
最初にサイトを立ち上げる時は以下のコマンドを打ちます。

```
$ hugo new site sample_site
```

#### ディレクトリ構成
Hugoのディレクトリの基本構成は以下のようになっています。


```
.
├── README.md
├── archetypes
│   └── 記事の雛形.md
├── config.toml
├── content
│   └── 実際の記事.md
├── data
├── layouts
│   ├── _default
│   ├── index.html
│   ├── partials
│   ├── shortcodes
│   └── taxonomy
├── public
│   └── ビルドした成果物が入る 
├── resources
├── static
│   └── 静的ファイル
└── themes
	└── hugo のテーマファイル
```


各ディレクトリについて簡単に説明します。

##### archetypes/

記事を各祭のMarkdownファイルの雛形をここにいれることができます。

##### config.toml

一部を抜粋すると以下のような感じです。
各ページ内で使用できる変数や、baseurlなどの基本設定をここで行うことができます。

```
baseurl = "https://blog.foresta.me/"
languageCode = "jp"
countryCode = "ja"
title = "blog.foresta.me"

[taxonomies]
category = "categories"
tag = "tags"

[Params]
author = "kazuki morita"
description = "日々の開発とかいろいろ"
noimage = "noimage.jpg"

[permalinks]
posts = "/posts/:filename/"
```
##### content/

記事を書く時は、
```
$ hugo new 記事名.md
```

とするのですが、上記コマンドを打つことによって、content/ 配下にMarkdownファイルが生成されるので、そのファイルを編集することで記事を執筆します。


##### data/

よくわかってません。自分の環境では使ってません。

##### layouts/

トップページやそれぞれの記事ページ、などのHTMLファイルはこの中に記載します。

##### public/

```
$ hugo
```

上記コマンドで生成された最終的なhtmlファイルやcssファイルなどもろもろのファイルが生成される場所です。

##### resources/

よくわかってません。本環境では使ってないです。

##### static/

jsやcssなどの静的ファイルが置かれます。このディレクトリ内のファイルは `hugo` コマンドでそのままpublicディレクトリへコピーされます。

##### themes/

Hugoのサイトテーマを入れる場所です。本環境では使ってないです。

---

これらの他に、私の環境ではsrcディレクトリを用意しています。

このディレクトリ配下に、scssファイルをいれ、webpackでビルドし、staticディレクトリへコピーさせてます。

webpack.config.jsは以下のような感じです。
```js
const path = require('path')

module.exports = {
  entry: {
    "javascripts/entry": "./src/entry.js", 
    "javascripts/preload": "./src/preload.js",
  },
  output: {
    path: path.resolve(__dirname, "static"),
    filename: "[name].bundle.js"
  },
  module: {
      rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["es2015"]   
        }
      },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: 'url-loader?limit=100000' }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"]
  }
};
```


### Jenkinsについて

{{<figure src="https://image.slidesharecdn.com/technologies-that-support-blog-writing-190331055335/95/-19-638.jpg?cb=1554012640">}}

上記スライドでも説明しましたが、Jenkinsは普通にCentOSにインストールして少し設定をいじった程度です。
デプロイスクリプトに関してはこちらもすごく簡単なもので、`npm系のインストールやらビルドやら` をして `hugoで記事をビルド` したのちに、`rsyncでHTTPサーバーのドキュメントルートにコピー` しています。

ディレクトリの説明の時に言及しましたが、hugoでビルドされた成果物は public/ 配下に生成されるので、rsyncコマンドでデプロイするのはこの publicディレクトリ以下のみとなります。
 
### PWA対応について

詳しくは以下の記事にまとめていますので、よかったら参考にしてみてください。\
https://blog.foresta.me/posts/add_to_home_screen_on_hugo/

## LT発表してみての感想

そもそもこのテーマで発表しようと思ったきっかけは、自分のブログを色々改造していくうちに結構愛着が湧いてきたし、色々な分野の知見がちょっとずつ溜まったので、発表ネタにしてしまおうといったものでした。\
あとは、発表すること自体普段あまりやらないので、リハビリのような側面もありました。


久しぶりのLTでやたら緊張しましたが、終わった後いろんな人に話しかけてもらってよかったです。\
また機会があれば積極的に登壇していきたいなと思います。
