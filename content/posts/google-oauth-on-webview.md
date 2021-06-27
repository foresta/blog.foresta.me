+++
title="WebView で Google ログインが出来ない"
date="2021-06-27T18:25:21+09:00"
categories = ["engineering"]
tags = ["auth", "google", "oauth", "webview"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は WebView 上で Google ログインを実装しようとしてできなかったので，メモを残しておきます．


## WebView と Google ログイン

WebView で Web ページを開いて表示するアプリは色々とあると思いますが，そのアプリ内で開いたWebサイトで Google ログインを行おうとすると以下のようなエラーが表示されます．

{{< figure src="/images/posts/google-auth-on-webview/google-auth-error.png" >}}


原因としては，Googleの {{< exlink href="https://developers-jp.googleblog.com/2016/09/modernizing-oauth-interactions-in-native-apps.html" text="公式のドキュメント" >}} にも記載されていますが，組み込みの WebView を許可しなくなったようです．

これは 2016 年から許可されていないため，かなり昔の話でしたがそもそも WebView を考慮に入れること事態少なくなってきたので今回問題に直面して初めてこの仕様を知りました．


対応作としては，以下のようなアプリとデフォルトのブラウザを連携するような仕組みを使うとうまく行くようですが，こちらまだ検証などはできてません．

- Android
Chrome Custom Tabs(Chrome 45以降、Support Library ver23以降)
- iOS
SFSafariViewController(iOS9以降)

## 参考サイト

- {{< exlink href="https://developers-jp.googleblog.com/2016/09/modernizing-oauth-interactions-in-native-apps.html" text="Google Developers Japan: ネイティブ アプリの OAuth インタラクションを最新にしてユーザビリティとセキュリティを向上する" >}}
- {{< exlink href="https://qiita.com/chano2/items/8acf0744bd0d513ce88c" text="アプリ組み込みのWebビューによるGoogle OAuth認証リクエストが遮断されます - Qiita" >}}
