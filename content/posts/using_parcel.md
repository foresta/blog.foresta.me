+++
title = "Parcelで静的ページをつくってみた"
thumbnail = ""
tags = ["parcel", "javascript", "sass", "html"]
categories = ["engineering"]
date = "2018-10-21"
+++

## 背景

だいぶ昔に、自分のホームページ製作をやろうかなーと思い、中途半端に作って放置してたのですが、
今回重い腰を上げて製作を始めようとしました。

しかし、そんな私の前に立ちふさがったのは、はるか昔に作成したまま動かぬものと化したgulpfile。\
何もしてないのに壊れたってやつです。(多分npmとかのバージョンガンガン上げてたからそれ)

もうエラーを直すのも億劫なので、ビルド環境を作り直そうと思いちょっと前から気になっていたparcelを使って見ました。

結論から言うと、かなり簡単にサクッと導入できたので最高でした。


せっかく試したので軽くまとめておきます。

## 前提

すごくシンプルなこんなサイトを公開したかった(https://foresta.me)

* 公開したいのはHTMLファイル1つ
* CSSはSASSを使いたい
* JSはそんなに書かない想定

## 導入

最初に今回対応した、ページのリポジトリはこちらです。\
(https://github.com/foresta/foresta.me)

今までのgulpfileなどを全削除して、npm initからはじめました。

```
$ npm init
$ npm i -D parcel
```

今回のケースだと環境構築は以上で終了なので非常にお手軽です。


### ローカルでの開発

今回作成したページのディレクトリ構成はこんな感じになっています。

```
$ tree -I "node_modules"
.
├── README.md
├── dist/
├── package-lock.json
├── package.json
└── src
    ├── app.js
    ├── images
    │   └── profile.jpg
    ├── index.html
    └── sass
        ├── _base.scss
        ├── _color.scss
        ├── _font.scss
        ├── _media-query.scss
        ├── _reset.scss
        └── style.scss

4 directories, 20 files

```

以下のコマンドを打つと、ビルドとローカルにサーバーが立ち上がるのでそこで動作確認しつつページを実装していけばOKな感じです。
(自分が試した時は, localhost:1234 が立ち上がりました)

```
$ npx parcel ./src/index.html
```

自分はnpmスクリプトとして以下のように設定しました。


```js
{
  // ...

  "scripts": {
    // ...
    "start": "npx parcel ./src/index.html",
    // ...
  },

  // ....
}
```

これで、`npm run start` でローカルサーバーが起動するようになります。

### プロダクション用にビルド

実際にサーバー上に配置する際は以下のようにしてビルドしてやればOKです。

```bash
$ npx parcel build ./src/index.html
```

こちらも例のごとく, npmスクリプト化してます。
```js
{
  // ...

  "scripts": {
    // ...
    "build": "npx parcel build ./src/index.html",
    // ...
  },

  // ....
}
```

自分の環境だとjenkinsとかで、masterブランチへのpushをhookして以下のようなスクリプトでデプロイをしてます。

```bash
npm install
npm run build

rsync -rlptgoD --delete --exclude ".git/" jenkinsのワークスペースへのパス/dist/ デプロイ先のパス
```

## まとめ

フロントエンド力がそんなにない自分でも、非常に簡単に導入できてハッピーでした。
今回のような簡単な構成のページをサクッとリリースするのには、parcelは割と相性が良いのではないかと思います。

かなり楽できたのでおすすめです。

{{< tweet user="kz_morita" id="1051139992045551617" >}}

## 参考

* https://github.com/parcel-bundler/parcel
* https://qiita.com/tonkotsuboy_com/items/2f96263294fad7661a82

