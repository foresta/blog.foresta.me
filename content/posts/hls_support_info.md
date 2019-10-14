+++
title = "HLSのブラウザの対応状況についてまとめてみた"
thumbnail = ""
tags = ["hls", "video", "browser"]
categories = ["engineering"]
date = "2019-10-14"
+++

こんにちは、[@kz_morita](https://twitter.com/kz_morita)です。\
最近動画周りの実装をすることが多かったのですが、今日は HLS (Htttp Live Streaming) 動画のブラウザの対応状況についてまとめてみます。

## HLS のブラウザのサポート状況

HLS 形式の動画を再生するには、以下の２つの条件のいずれかを満たす必要があります。

- ブラウザがネイティブで HLS の再生をサポートしている
- Polyfill 実装のライブラリを使用できる

各ケースについて簡単にまとめます。

## ブラウザがネイティブでサポートしている

HLS 動画の再生をデフォルトでサポートしているのは以下のブラウザです。

- Safari (iOS, macOS etc...)
- Windows Edge

## Polyfill 実装を利用できる

今回は、Polyfill 実装のライブラリを Hls.js とします。
https://github.com/video-dev/hls.js

Hls.js を使用するためには、ブラウザが Media Source Extensions に対応している必要があります。

詳しくは以下を参照してみてください。
https://caniuse.com/#feat=mediasource

具体的に Hls.js を使用できないのは以下のようなブラウザたちです。

- IE 6 ~ 10
- Windows 7 以下の IE 11
- iOS Safari (ネイティブで再生はできる)
- Opera mini
- Samsung Internet
- QQ Browser
- etc...

## iOS Safari について

iOS Safari については、ネイティブで再生はできるのですが、\
[以前のこの記事](/posts/hook_decryptkey_request_on_hls_js/) で説明したような、Hls.js をハックして通信を hook したりすることができないため注意が必要です。

## まとめ

簡単に HLS 動画のサポート状況について簡単にまとめました。
個人的には、 iOS Safari が早く Media Source に対応して欲しいところですが、ネイディブで再生できる分対応の優先度が低めに対応されてたりするのかなーと推測しています。

今回 Web Front の実装を久しぶりに行って、各ブラウザの対応状況などを確認するのは大変だなーと思いつつも大事なことなのでちゃんと確認するべく、注意していきたいと思いました。
