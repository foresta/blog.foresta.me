+++
title="CORS Policy 違反と，Preflight request (OPTIONS) について"
date="2020-09-06T00:02:15+09:00"
categories = ["engineering"]
tags = ["http", "options", "preflight_request", "cors"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，現在実装しているサービスで遭遇したエラーとそれについて調べる過程で調査した，HTTP の Preflight request についてまとめていきます．

## 発生したエラー

前提として，いま開発しているサービスは，Web Server と，API Server が別れています．\
(つまり https://example.com と https://api.example.com のようにドメインが別になっています)

そして，普通に API に対して GET リクエストを送っていたときは問題なかったのですが，POSTリクエストを送ろうとしたときに以下のようなエラーが発生しました．

`Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response.`

エラーメッセージからどうやら CORS 系のエラーだろうなと思って調べたところ，どうやら Preflight request (OPTIONS) が飛んでいて，その影響で API Server (正確にはその前にいた nginx ) の `Access-Control-Allow-Headers` に `Content-Type` が記載されていなかったことが原因でした．

## Preflight request とは

Preflight request とは，CORS (Cross-Origin Resource Sharing) の中でブラウザが自動で飛ばすリクエストで，特定の条件を満たすと Chrome の Network タブなどに `OPTIONS` という HTTP Method でリクエストが投げられていることが確認できます．\
CORS の文脈なので，今回のケースのような Web Server と API Server の Origin が違うような場合の話になります．

{{< exlink href="https://developer.mozilla.org/ja/docs/Glossary/Preflight_request" text="Preflight request (プリフライトリクエスト)">}}


この Preflight request ですが，`単純リクエスト` と呼ばれるリクエスト `以外` の通信をおこなう際に，通信おこなう前にブラウザが自動で送信します．

単純リクエストは，以下のような条件を満たすリクエストのことになります．

- GET, HEAD, POST メソッドである
- 自動で付与されたヘッダー以外に，以下のヘッダーのみが付与されている
```
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type
  - DPR
  - Downlink
  - Save-Data
  - Viewport-Width
  - Width
```
- Content-Type ヘッダーで以下の値のみである
```
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain
```

今回は，POST メソッドなのですが，Content-Typeを `application/json` にしてリクエストしていたことで，単純リクエストに含まれず，Preflight request が飛んでいました．

### Access-Control-Allow-Headers レスポンスヘッダー

Access-Control-Allow-Headers では，Preflight request (OPTIONS) が行われた場合に，その次に通信が可能な，リクエストヘッダーを示すために使用されます．

今回だと，nginx で定義されていたのは，`Authorization` と `X-XSRF-TOKEN` ２つでした．ここに `Content-Type` を追加することで今回のエラーは解消されました．

```diff
- add_header Access-Control-Allow-Headers "Authorization, X-XSRF-TOKEN";
+ add_header Access-Control-Allow-Headers "Authorization, X-XSRF-TOKEN, Content-Type";
```

#### 追加の制約

ただし，注意が必要なのが通常であれば Content-Type は セーフリクエストヘッダーとして定義されているため，`Access-Control-Allow-Headers` に設定する必要がありません.

> CORS セーフリストリクエストヘッダー, Accept, Accept-Language, Content-Language, Content-Type は常に許可されており、このヘッダーで列挙する必要はありません。しかし、これらのヘッダーを Access-Control-Allow-Headers に列挙することで、これらのヘッダーでも追加の制約の適用を回避することができることに注意してください。

{{< exlink href="https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Access-Control-Allow-Headers" >}}

しかし，これにも追加の制約が課せされる場合があり，今回はこのケースに当てはまったため定義する必要がありました.

以下の制約を満たさない通信の場合は，`Accept`, `Accept-Language`, `Content-Language`, `Content-Type` でもCORSセーフリクエストヘッダーとして許可されません．

##### CORS セーフリクエストヘッダーとなるための制約
- `Accept-Language`, `Content-Language` に，`0-9`, `A-Z`, `a-z`, `スペース`, `*,-.;=` のみが含まれている
- `Accept`, `Content-Type` に，unsafe な byte が含まれていない ( {{< exlink href="https://fetch.spec.whatwg.org/#cors-unsafe-request-header-byte" text="詳しくはこちら" >}} ) 
- `Content-Type` に `application/x-www-form-urlencoded` , `multipart/form-data`, `text/plain` のいずれかの値のみが含まれている
 
今回は，`application/json` を送ろうとしていたため，`Content-Type` も Access-Control-Allow-Headers に定義する必要がありました．

https://developer.mozilla.org/ja/docs/Glossary/CORS-safelisted_request_header#Additional_restrictions

## まとめ

今回は，実際に開発中に遭遇したエラーの調査を通して，CORS における Preflight request や それにまつわる Header などについてまとめました．
いままで，あまり意識したことのないところでしたが，実際にエラーに遭遇してそれを調べて解決するとかなり理解が深まるなと再認識できました．

HTTP は色々な仕様があってかなり深いなぁと思うとともに，それらがわかりやすく書かれている {{< exlink href="https://developer.mozilla.org/ja/docs/Web" text="MDN Web docs" >}} にはいつもお世話になっていてありがたい限りです．
