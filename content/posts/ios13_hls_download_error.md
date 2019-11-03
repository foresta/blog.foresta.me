+++
date = "2019-11-03"
title = "iOS13でHLS動画をダウンロードする際の注意点"
thumbnail = ""
tags = ["ios", "swift", "ios13", "hls"]
categories = ["engineering"]
+++

こんにちは、[kz_morita](https://twitter.com/kz_morita)です。\

つい先日 iOS13 対応の作業を行っていたのですが、その中で iOS13 で HLS 形式の動画がダウンロードできなくなるバグが発生したのでそのことについてまとめます。

## 対象となるダウンロード方法

以下の記事で行っているダウンロード方法において, iOS13 で HLS 動画のダウンロードができなくなる不具合が発生しました。

[iOS の HLS ダウロードと aggregateAssetDownloadTask の assetTitle のバグについて](/swift_hls_download_bug/_)

## メディアプレイリストのダウンロードが不可能に

今回上記のの方法でダウンロードできなくなった原因を調べて行った結果、どうやらメディアプレイリストを指定した場合に上記の方法ではダウンロードできない模様でした。

元々メディアプレイリストを指定していたのは、高画質や低画質を指定してダウンロードするためだったのですが、今回 iOS13 でそれらがダウンロードできなくなりました。

そのため、高画質や低画質用のマスタープレイリストを別途用意してそちらを指定するようにすることで、iOS13 でもダウンロードが行えるようにしました。

### メディアプレイリストとマスタープレイリストについて

HLS のプレイリストファイルには、メディアプレイリストとマスタープレイリストの二種類があります。

以下にそれぞれのサンプルを記載します。

#### メディアプレイリスト

```m3u8
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:9.843167,
video000.ts
#EXTINF:8.708700.
video001.ts
#EXTINF:8.808800.
vodeo002.ts
...
..
.
#EXT-X-ENDLIST
```

メディアプレイリストの主な役割としては実際の動画ファイルをセグメント化した `.ts` ファイルを指定することになります。

### マスタープレイリスト

```m3u8
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=1280000,AVERAGE-BANDWIDTH=1000000
http://example.com/low.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2560000,AVERAGE-BANDWIDTH=2000000
http://example.com/mid.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=7680000,AVERAGE-BANDWIDTH=6000000
http://example.com/high.m4u8
```

マスタープレイリストでは、帯域幅などを指定して通信状況に応じてメディアプレイリストを切り替えるといった指定をすることができます。

このインターネット帯域によって適切なビットレートのストリームに切り替えて再生する技術のことを、アダプティブストリーミングといったりします。

## まとめ

iOS13 で HLS 動画のダウンロードする際の注意点について簡単にまとめ、メディアプレイリストとマスタープレイリストについてまとめました。
iOS は 1 年に一度おおきなアップデートがくるので、毎年 9 月頃になるとそわそわしだしますがこういった思わぬ不具合が起きたりするため、Apple の更新情報を注意深くみていくことが大事だなぁと思いました。
