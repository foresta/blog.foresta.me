+++
title = "GitHub ActionsでHugoのブログをVPSにデプロイする"
thumbnail = ""
tags = ["github_actions", "hugo", "さくらvps"]
categories = ["engineering"]
date = "2019-12-03T00:00:00+09:00"
+++

この記事は、[write-blog-every-week Advent Calendar 2019](https://adventar.org/calendars/3945) の 3 日目の記事です。

こんにちは、[@kz_morita](https://twitter.com/kz_morita) です。ブログを初めてはや 1 年ちょっと経ちました。

このブログは [Hugo](https://gohugo.io/) という静的サイトジェネレータでビルドをして、さくら VPS にデプロイをしています。
VPS 上には Jenkins が動いており、GitHub の push を hook してデプロイを行ってました。

詳しくは下記の記事を参考にしていただければと思います。 \
[ブログ執筆を支える技術というタイトルで LT をしてきた話](/posts/lightning_talk_20190331/)

今回は、最近発表された GitHub Actions が便利そうだったのでそちらでデプロイをするようにしてみました。

## GitHub Actions とは

GitHub Actions は GitHub が提供する CI / CD 環境です。

https://help.github.com/ja/actions/automating-your-workflow-with-github-actions/about-github-actions

料金としては、Public リポジトリであれば無料。
プライベートリポジトリであれば、Github の登録プランとデフォルトの使用制限を超えると超過分が請求されるといった形です。

使用制限は下記の表の通りです。\
(引用元: https://help.github.com/ja/github/setting-up-and-managing-billing-and-payments-on-github/about-billing-for-github-actions)

| 製品                    | ストレージ | Minutes (per month) |
| ----------------------- | ---------- | ------------------- |
| GitHub Free             | 500 MB     | 2,000               |
| GitHub Pro              | 1 GB       | 3,000               |
| GitHub Team             | 2 GB       | 10,000              |
| GitHub Enterprize Cloud | 50 GB      | 50,000              |

詳しくは以下の公式サイトから確認してみてください。

https://help.github.com/ja/actions

## Action を作成する

それでは早速 Actions を作成していきます。

Action は GitHub の該当の Repository の Actions メニューから追加します。

{{< figure src="/images/posts/deploy_blog_with_github_actions/github_actions_menu.png" >}}

New workflow を押すと実際に作成することができます。

テンプレートのようなものがいくつか選ぶことができるようです。
今回は `Set up a workflow yourself` を押して一からつくってみます。

{{< figure src="/images/posts/deploy_blog_with_github_actions/github_actions_setup_workflow.png" >}}

Workflow を作成すると、以下のような workflow の編集画面が表示されます。右側の Marketplace では、公開されている Actions を使用することもできます。

{{< figure src="/images/posts/deploy_blog_with_github_actions/github_actions_workflow_editor.png" >}}

ここで Actions を作成して、 `Start commit` を押してコミットをするとリポジトリの下の、`.github/workflows/{name}.yml` というファイルがコミットされます。

Action が作成され実行されると、Actions タブから実行のログを確認することができます。

{{< figure src="/images/posts/deploy_blog_with_github_actions/github_actions_workflow_log.png" >}}

## VPS にデプロイする Actions をかいてみる

それでは実際に、ブログを VPS にデプロイする Actions をかいてみます。
最初に完成品である自分の設定を載せます。

```
name: deploy to server

on:
  push:
    branches:
      - master

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v1
    - name: Setup hugo
      run: |
          wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}-64bit.deb
          sudo dpkg -i hugo_${HUGO_VERSION}-64bit.deb
          hugo version
      env:
          HUGO_VERSION: '0.18.1'
    - name: Setup node
      uses: actions/setup-node@v1
      with:
        node-version: '10.x'
    - name: Start build
      run: echo Build started.
    - name: Npm install
      run: npm install
    - name: Webpack
      run: npm run webpack
    - name: Build hugo
      run: hugo
    - name: Generate ssh key
      run: echo "$SSH_PRIVATE_KEY" > key && chmod 600 key
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
    - name: Deploy
      run: rsync -rlptgoD --delete --exclude ".git/" -e "ssh -i ./key -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p ${SSH_PORT}" public/ $SSH_USER@$SSH_HOST:$DEPLOY_PATH
      env:
        SSH_USER: ${{ secrets.SSH_USER }}
        SSH_PORT: ${{ secrets.SSH_PORT }}
        DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
        SSH_HOST: ${{ secrets.SSH_HOST }}
```

上記の設定ファイルについて１つずつ説明していきます。

#### Action Name

```
name: deploy to server
```

こちらは作成する Action の名前になります。上記の Action の実行結果のところなどで表示されるためわかりやすい名前をつけておくと良いでしょう。

#### トリガー

```
on:
  push:
    branches:
      - master
```

こちらでは、Action が実行されるためのトリガーの設定が行えます。上記の設定では、master ブランチが push された時に実行されるようにしています。

#### Jobs

```
jobs:
  build:
```

Action で実行される実際の動作は、`jobs:` の下にかいていきます。\
上記の `build:` は識別名なので自分のわかりやすい名前ならなんでも大丈夫です。

#### Runs on

```
    runs-on: ubuntu-latest
```

上記は、ubuntu 上で CI を行うということを指定しています。他にも windows や mac も使えるので、必要に応じて設定しましょう。

#### Steps

```
    steps:
```

steps:の下に実際のビルドの flow をかいていきます。

今回の Actions では以下の 9 つの step を定義しました。順を追って説明していきます。

- Checkout
- Setup hugo
- Setup node
- Start build
- Npm install
- Webpack
- Build hugo
- Generate ssh key
- Deploy

#### Checkout

```
    - name: Checkout
      uses: actions/checkout@v1
```

まず最初に行われているのが上記です。こちらは 本リポジトリをチェックアウトしてくるためのものになります。
`name:` ではこのステップの名前をしていします。こちらの名前は実際に実行されている Action のステップ名として以下のように表示されます。

{{< figure src="/images/posts/deploy_blog_with_github_actions/github_actions_workflow_steps.png" >}}

`uses:` は他の人が作成した Actions を実行するためのものです。checkout に関しては、公式で用意されているのでこちらを使用しています。

#### Hugo

```
    - name: Setup hugo
      run: |
          wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}-64bit.deb
          sudo dpkg -i hugo_${HUGO_VERSION}-64bit.deb
          hugo version
      env:
          HUGO_VERSION: '0.18.1'
```

ここでは、Hugo のセットアップをしています。今回 CI を動かす OS は ubuntu なので、`.deb` ファイルを wget で取得してきてインストールをします。

#### Node

```
    - name: Setup node
      uses: actions/setup-node@v1
      with:
        node-version: '10.x'
```

ここでは、Node の環境構築をしています。公式で Node のセットアップ用の Actions が公開されていたのでそちらを利用しました。

#### Build

```
    - name: Start build
      run: echo Build started.
```

ここまででビルド環境の構築が完了しましたので、ここからは実際にページのビルドを行っていきます。\
ここでは、ビルド開始をログとして出力しています。

#### npm install

```
    - name: Npm install
      run: npm install
```

まずは、npm install を行います。

#### webpack

```
    - name: Webpack
      run: npm run webpack
```

そして、webpack で asset をバンドルします。

`npm run webpack` で production 用にバンドルするように `package.json` に npm script を記載してあります。

#### Build hugo

```
    - name: Build hugo
      run: hugo
```

先ほどインストールした Hugo でマークダウンから静的サイト（html）を生成します。生成された静的ファイルは `public/` ディレクトリ以下に配置されます。

#### Generate ssh key

```
    - name: Generate ssh key
      run: echo "$SSH_PRIVATE_KEY" > key && chmod 600 key
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
```

ここでは、VPS にデプロイするための鍵の準備をしています。秘密鍵の内容はリポジトリの環境変数として設定しています。
環境変数は Settings > Secrets から設定することができます。

今回は以下のような情報を環境変数として設定しています。こちらに設定されたデータはリポジトリが Fork されてもコピーされないため安全です。

{{< figure src="/images/posts/deploy_blog_with_github_actions/github_actions_secrets_environment.png" >}}

#### Rsync deploy

```
    - name: Deploy
      run: rsync -rlptgoD --delete --exclude ".git/" -e "ssh -i ./key -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p ${SSH_PORT}" public/ $SSH_USER@$SSH_HOST:$DEPLOY_PATH
      env:
        SSH_USER: ${{ secrets.SSH_USER }}
        SSH_PORT: ${{ secrets.SSH_PORT }}
        DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
        SSH_HOST: ${{ secrets.SSH_HOST }}

```

最後に、rsync を用いてデプロイします。
SSH の接続情報や、Deploy 先のディレクトリパスなどは Github の環境変数に登録しています。
rsync を用いて さくら VPS にデプロイするのですが、ssh 接続がひつようなため、ひとつ前の手順で作成した秘密鍵 (key) を用います。

```bash
ssh -i ./key -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p ${SSH_PORT}
```

`-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null` を追加して fingerprint の確認を行わないようにしないと接続ができないため注意が必要です。

参考: [cron やプログラムで ssh 越し rsync を利用するときにカナリ便利なオプション](https://www.l2tp.org/archives/2513)

rsync の文法については、[man page](https://linux.die.net/man/1/rsync) や、[こちら](https://qiita.com/bezeklik/items/22e791df7187958d76c1) などを参考にしてみてください。

## まとめ

今回は VPS へのデプロイを Jenkins から、Github Actions へ変更してみました。基本的に、yaml を編集していくだけで非常に直感的に定義することができるのでとてもわかりやすかったです。
実際 ssh の鍵周りなどで若干戸惑ったものの、キャッチアップから含めて 2 時間くらいでさくっと移行できたのは非常に良かったです。

また、CircleCI の Orbs のように、他の人が実装した Actions も再利用可能なので、たくさんの Actions が開発されることによりどんどんエコシステムが発達していけばさらに便利になっていくのだろうなと感じました。
今回のように静的サイトをデプロイするだけのような用途であれば、非常にさくっと導入できるのでもしご興味がある方は試していただけると良いと思いました。

{{< tweet 1199657978376245249 >}}
