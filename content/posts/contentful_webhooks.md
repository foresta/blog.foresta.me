+++
title="Contentful の Webhook を使ってみる"
date="2020-09-27T21:31:25+09:00"
categories = ["engineering"]
tags = ["contentful"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Contentful は，多機能で非常に使いやすいヘッドレス CMS です．Webhook の機能も備わっており，Content の公開時などのタイミングで API を呼び出したりすることが出来ます．

https://www.contentful.com/developers/docs/concepts/webhooks/

今回は，この Webhook の機能を使って Entry の公開時に特定のAPIを叩くといった使用方法を紹介します．

## Webhookの設定

ナビゲーションバーから，Settings > Webhooks を選択します．

{{< figure src="/images/posts/contentful_webhooks/contentful-1.png">}}


Add Webhook を選択すると以下のような画面になります．


{{< figure src="/images/posts/contentful_webhooks/contentful-2.png">}}
{{< figure src="/images/posts/contentful_webhooks/contentful-3.png">}}

設定できる要素を一つずつ簡単に紹介していきます．

### Details

#### Name
Webhook の名前を指定できます．

#### URL
Webhook 時に叩くAPIを指定することが出来ます．上記のスクリーンショットの例では，`https://api.example.org` という URL に対して `POST` リクエストを投げるようになっています．リクエストボディについては後述します．

### Triggers

Contentful で編集などを行った際のどのイベントでこのWebhook を発火させるかという指定が出来ます．

今回は，Entry が Publish されたタイミングでのみ発火するように設定しています．

上の，`Triggers for all events` を選択するとすべてのイベントで発火することになります．

#### Filters

発火するイベントをフィルタリングすることが出来ます．

今回で言うと，Content Type ID が，`article` となっている Entry が Pubish されたときのみ発火するようにしています．

`Content Type ID` は，Content model で定義したモデルの ID のことで，Article モデルのみを Publish するといった制御がおこなえます．

Content Type ID の他に，`Environment ID`, `Entity ID` を指定することができます．

### Headers 

HTTP の Request Header を指定することが出来ます．例えば，API に認証が必要であれば，Authorization ヘッダをつけるといったことが可能です．\
選択できるものとして，`Add custom header` と `Add secret header` と `Add HTTP Basic Auth header` の３つがあります．

認証Tokenなどを用いる場合は，secret header として登録すると `Contentful` の管理画面上でもマスクされて表示されるため安全です．


#### Content type

Content type ヘッダを指定できます．デフォルトでは `application/vnd.contentful.management.v1+json` という値が指定されています．
Contentful 独自の MimeType なので，APIが対応していない場合は， `application/json` を選択すると良いでしょう．


#### Content length

こちらは，チェックを入れると自動で計算して指定してくれるため，チェックしておくと良いと思います．

### Payload

最後に Payload で送信する内容をしていします．

デフォルトだと以下のような body になります．

```js
{
  "sys": {
    "type": "Entry",
    "id": "hogehoge",
    "space": {
      "sys": {
        "type": "Link",
        "linkType": "Space",
        "id": "fugafuga"
      }
    },
    "environment": {
      "sys": {
        "id": "master",
        "type": "Link",
        "linkType": "Environment"
      }
    },
    "contentType": {
      "sys": {
        "type": "Link",
        "linkType": "ContentType",
        "id": "article"
      }
    },
    "revision": 2,
    "createdAt": "2020-03-30T09:10:33.573Z",
    "updatedAt": "2020-09-27T13:03:23.346Z"
  },
  "fields": {
    "title": {
      "ja-JP": "Article1"
    },
    "eyecatch": {
      "ja-JP": {
        "sys": {
          "type": "Link",
          "linkType": "Asset",
          "id": "piyopiyo"
        }
      }
    }
  }
}
```

`sys` にmeta 情報が入り，`fields` に実際のデータが入ります．

また，Payloadはカスタマイズすることが出来ます．

customize the webhook payload にチェックを入れ，以下のように指定すると，
{{< figure src="/images/posts/contentful_webhooks/contentful-custom-payload.png">}}


以下のような Payload が送信されます．

```
{
  "entityId": "hogehoge",
  "title": "Article1"
}
```

## 何に使えるか？

例えば記事を掲載するWebサービスを作っていたとして，記事に対して `いいね！` など，ユーザーがアクションできるような仕様だったとします．

その場合，普通に実装すると いいね などの情報は RDB などに格納し，記事本体は Contentful の CDA (Content Delivery API) を用いて取得するといった方法になるかと思います．このようなケースでかつ RDB 上で Join したいといった場合に，今回紹介した Webhook を使用して，記事を RDB に登録してしまうといた使い方ができると思います．

`POST /articles` のようなエンドポイントを用意して，その API 経由で登録してしまうといった具合です．

これはすなわち，Contentful を CMS (Content Management System) としてのみ使用するといったアイデアになります．

## まとめ

今回は，Contentful の webhook について簡単に紹介しました．

Contentful はかなりいろいろな機能があるので，調べてみるとやりたいことは大抵できそうなイメージです．

画像系のAPIも充実しているので，良ければこちらの記事も参考にしえみてください．

[とても便利な Contentful Image API](/posts/contentful_image_url)
