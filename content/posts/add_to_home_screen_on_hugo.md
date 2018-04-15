+++
date = "2018-04-15T22:32:44+09:00"
title = "Hugoで作成したブログをPWA対応した(ホーム画面に追加のみ)"
thumbnail = ""
tags = ["hugo", "pwa"]
categories = ["engineering"]

+++

# 背景

PWA(Progressive Web Apps)自体は以前から気にはなっていたのですが、最近iOS11.3のSafari11.1から対応されるとのことで周囲でちょっと盛り上がってたので自分のブログに対応させてみたくなってしまったので対応させました。

今回説明するのはホームスクリーンにアイコンを設置できるようにするところまでです。

# 前提


[公式サイト](https://developers.google.com/web/fundamentals/app-install-banners/?hl=ja)によるとバナーが出る条件は以下のようになっています。

```
* 次の情報が記述されたウェブアプリ マニフェスト ファイルが存在する。
  - short_name（ホーム画面で使用）
  - name（バナーで使用）
  - 192x192 の png アイコン（アイコンの宣言には MIME タイプ image/png の指定が必要）
  - 読み込み先の start_url

* サイトに Service Worker が登録されている。
* HTTPS 経由で配信されている（Service Worker を使用するための要件）。
* 2 回以上のアクセスがあり、そのアクセスに 5 分以上の間隔がある。
```



対象のWebサイトのhttps対応が必須なので
やられてない方はLet's Encryptなどを用いてhttps対応してください。

(手間みそですが、さくらVPSに導入する記事です。https://qiita.com/kz_morita/items/ba9c171633ca54d72d2a)


# やったこと

https対応はすでにしているので今回やらなきゃいけないことは以下の二つです。

* manifestファイルの用意
* ServiceWorkerの登録

順に説明していきます。

## manifest.jsonの作成

以下のようなjsonファイルを作成しました。

```json
 {
  "icons": [
    {
      "src": "images/logo/logo-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "images/logo/logo-256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "images/logo/logo-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/logo/logo-144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "images/logo/logo-96.png",
      "sizes": "96x96",
      "type": "image/png"
    }
  ],
  "name": "foresta's blog",
  "short_name": "foresta's blog",
  "orientation": "portrait",
  "display": "standalone",
  "start_url": "/",
  "description": "foresta's developer blog",
  "theme_color": "#61c0ca",
  "background_color": "#61c0ca"
}
```

このファイルを以下のパスに配置します。

```
hugoのhome/static/manifest.json
```

hugoのstatic配下のフォルダはhugoコマンドでビルドする際に、ドキュメントルート直下に配置されます。
自分の場合だと、https://blog.foresta.me/manifest.json です

設定する項目ですが、最低でも以下の項目は必須のようです。

* 192x192のicon
* short\_name（ホーム画面で表示）
* name（バナーで表示）
* start\_url（読み込み先のURL）

## アイコンの準備
上記で指定したアイコンを各サイズ準備しました。

こんなやつ
{{< figure src="/images/posts/add_to_home_screen_on_hugo/logo-192.png" >}}

## manifest.jsonの読み込み

以下の一行をHTMLのヘッダタグないに追加

```html
  <link rel="manifest" href="/manifest.json" />
```

## service workerの対応

以下のようなファイルを作成

sw.js
```js
console.log("hello from service worker");

self.addEventListener('fetch', function(event) {

});
```

空でも良いと言う記事も結構見かけたのですが、fetchイベントを記述しないと動かなかったです。

これを以下のパスに配置します。

```
hugoのhome/static/sw.js
```

## service worker登録

bodyタグの最後に以下のスクリプトを記述します。

```html
  <script>
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  </script>
```

正しく動いているかChromeのDevToolから確認できます。

Applicationタグに以下のように表示されればOKです。


{{< figure src="/images/posts/add_to_home_screen_on_hugo/manifest.png" >}}
 

{{< figure src="/images/posts/add_to_home_screen_on_hugo/service_worker.png" >}}


# Android端末での確認方法

実機で確認しようとした時に以下の条件が厄介なので、デバッグ用に解除します。
```
* 2 回以上のアクセスがあり、そのアクセスに 5 分以上の間隔がある。
```

Androidで 

* chrome://flags/#bypass-app-banner-engagement-checks にアクセス
* 有効化してChromeを再起動

以上の動作により、一度目のアクセスでもホーム画面に追加しますかのバナーが表示されるようになります。

# まとめ

hugoで構築しているブログのPWA対応の手始めとして、ホームにアイコン追加するまでやってみました。
多少苦戦しましたが、割とスムーズに導入できてよかったです。


時間があればオフライン対応や、push通知の対応をやってみようかと思います。


# 参考サイト
* https://developers.google.com/web/fundamentals/app-install-banners/?hl=ja
* https://amymd.hatenablog.com/entry/2017/10/12/001612
