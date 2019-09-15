+++
title = "hls.jsの通信をhookして復号鍵をAPI経由でリクエストする"
thumbnail = ""
tags = ["hls", "hls.js", "javascript"]
categories = ["engineering"]
date = "2019-09-15"
+++

こんにちは、[kz\_morita](https://twitter.com/kz_morita)です。\

HLS動画を暗号化する際に、外部のDRMサービスを使用せずに動画の閲覧権限管理を行いたかったので、動画の復号鍵をAPI経由で取得できるようなシステムについて考えてみました。

## 全体のアーキテクチャ

今回はHLSのプレイリストファイルのURLがバレても、サービスが提供する動画プレイヤー以外では動画を再生できないといったものを想定しています。
APIで認証情報をチェックできるという前提のもと、以下のような構成を考えています。

{{< figure src="/images/posts/hook_decryptkey_request_on_hls_js/architecture.png" >}}

動画再生までの手順としては以下のような感じです。

1. APIから動画情報を取得してくる
2. 動画情報に含まれるHLSのプレイリストファイル(.m3u8) へのパスを指定して動画プレイヤーで再生開始
3. 動画プレイヤーをhookして、鍵リクエストだったらAPIサーバーに鍵を取りに行く
4. 鍵リクエスト以外であれば、通常通りHLSファイルが配置されている場所にリクエストを投げて再生する

## 鍵リクエストかどうかの判定

鍵リクエストかどうかを判定するために、鍵のURLをdummyのURL Scheme を持ったものにします。上記の例では、 `video://decryptkey` がそれにあたります。このURLであったら、リクエストをAPIへのものに差し替えて通信することで認証付きで復号鍵を取得しようという作戦です。

暗号化されたHLS動画の復号鍵の指定は、メディアプレイリストの `#X-EXT-KEY` タグで指定します。

具体的には以下のようなプレイリスト生成します。

```
#EXT-X-KEY:METHOD=AES-128,URI="video://decryptkey",IV=0x000000000000000000000000000000
```

## Hls.js で通信をhookする処理

Hls.jsを用いる時は以下のようにHls.jsを初期化します。

```js
// Videoタグを取得 (id="video" を想定)
var videoTag = document.getElementById('video')

var config = { /* ... */}
var hls = new Hls(config)
hls.loadSource("https://example.com/video.m3u8")
hls.attachMedia(videoTag)
```

通信をhookする際には、loaderをconfigで渡すとロード処理をカスタマイズすることができます。

https://github.com/video-dev/hls.js/blob/master/docs/API.md#loader

デフォルトのローダーは以下のものが使われているので、このLoaderの loadInternal メソッドを overrideすることで通信の挙動をカスタマイズできます。

https://github.com/video-dev/hls.js/blob/master/src/utils/xhr-loader.js


それでは実際に通信をhookしてAPIを叩くようなコードを書いてみます。

```js

// Customize した loadInternalメソッド
var customLoadInternal = function() {
  let xhr,
  context = this.context;
  xhr = this.loader = new XMLHttpRequest();

  // ここからカスタマイズ開始
  // ここで鍵URLかどうかの判定を行う
  if (
    context &&
    context.frag &&
    context.frag.levelkey &&
    context.url === context.frag.levelkey.reluri
  ) {
    // 復号鍵取得のAPIのURLに差し替える
    context.url = 'https://example.com/api/decryptkey';
  }
  //// ここまでカスタマイズ

  let stats = this.stats;
  stats.tfirst = 0;
  stats.loaded = 0;
  const xhrSetup = this.xhrSetup;

  try {
    if (xhrSetup) {
      try {
        xhrSetup(xhr, context.url);
      } catch (e) {
        // fix xhrSetup: (xhr, url) => {xhr.setRequestHeader("Content-Language", "test");}
        // not working, as xhr.setRequestHeader expects xhr.readyState === OPEN
        xhr.open('GET', context.url, true);
        xhrSetup(xhr, context.url);
      }
    }
    if (!xhr.readyState) {
      xhr.open('GET', context.url, true);
    }
  } catch (e) {
    // IE11 throws an exception on xhr.open if attempting to access an HTTP resource over HTTPS
    this.callbacks.onError(
      {code: xhr.status, text: e.message},
      context,
      xhr,
    );
    return;
  }

  if (context.rangeEnd) {
    xhr.setRequestHeader(
      'Range',
      'bytes=' + context.rangeStart + '-' + (context.rangeEnd - 1),
    );
  }

  xhr.onreadystatechange = this.readystatechange.bind(this);
  xhr.onprogress = this.loadprogress.bind(this);
  xhr.responseType = context.responseType;

  // setup timeout before we perform request
  this.requestTimeout = window.setTimeout(
    this.loadtimeout.bind(this),
    this.config.timeout,
  );
  xhr.send();
};

// カスタムローダ用のConfig. Credential 等を設定する
var config = {
  xhrSetup: function(xhr, url) {
    xhr.withCredentials = true; // do send cookie
    xhr.setRequestHeader('Authorization', 'hogehoge'); // 認証トークンなど
  },
};

// Defaultのloaderを継承 (prototype) して、loadInternalをoverride
var customLoader = function() {};
customLoader.prototype = new Hls.DefaultConfig.loader(config);
customLoader.prototype.loadInternal = customLoadInternal;

// customLoaderを渡してHlsを初期化
hls = new Hls({loader: customLoader});
 
```


このように実装すると、APIを叩き認証を通した上で復号鍵を取得することにより暗号化された動画の権限管理が可能になります。

普通に m3u8ファイルを直接指定して再生しようとした際には、暗号鍵が見つからず（URIがダミーのURL Scheme のため）、tsファイルだけ抜き出しても暗号化されているため、APIを通して暗号鍵を取得する必要が出てきて、結果として運営するサービスが提供する（hookする対応を入れた）動画プレイヤーでないと再生できないという要件が実現できます。

## まとめ

hls.jsを使って復号鍵をAPI経由で取得する方法について簡単にまとめました。
今回紹介した方法は、hls.jsを用いたWebだけですが、iOS / Android の各ネイティブアプリにおいても同様の実装を行うことで同じ要件を実現することができます。

今回この実装を行うにあたり、Hls.jsのソースコードを読みあさったりしてそこそこ大変だったので本記事が誰かのお役に立てたら嬉しいです。
