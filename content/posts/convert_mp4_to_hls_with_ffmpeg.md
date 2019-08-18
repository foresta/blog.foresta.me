+++
categories = ["engineering"]
date = "2019-08-18"
title = "ffmpeg を使って mp4 を HLS に変換する"
thumbnail = ""
tags = ["hls", "ffmpeg", "mp4"]
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita">}} です。

最近は動画のストリーミング再生やダウンロード周りの実装をすることが多く、特に HLS (HTTP Live Streaming) 周りを中心に触っています。
そこで今回は mp4 を HLS 形式に変換する方法についてまとめて行こうと思います。

## HLS は動画ストリーミング用のプロトコル

HLS は HTTP Live Streaming の略で Apple が定めた動画のストリーミング用の技術です。

特徴としては以下の項目が挙げられます。

- HTTP or HTTPS プロトコルを用いて配信できる（容易にキャッシュできる）
- 複数の bitrate で配信できる
- 現在のネットワークの帯域幅に応じて適切な bitrate で配信することができる
- 動画ファイルの暗号化をサポートできる

詳しくは以下のサイトを参考にしてみてください。

Apple 公式サイト
: https://developer.apple.com/streaming/

仕様
: https://developer.apple.com/streaming/HLS-WWDC-2017-Preliminary-Spec.pdf

## ffmpeg と m3u8 , ts ファイルの生成

上記で HLS について簡単に説明しましたが、HLS で動画をストリーミング再生する時には以下のファイルが必要です。

- .m3u8 ファイル
- .ts ファイル

m3u8 ファイルはどのようにストリーミング再生をするかを定義したマニフェストファイルです。\
ts ファイル分割された動画ファイルの実態です。

### ffmpeg で HLS 形式のストリーミング用動画を生成

それでは、ffmpeg というツールを用いてストリーミング用動画に変換していきます。
ffmpeg については、以下からダウンロードできますし、 macOS であれば `homebrew` でも簡単にインストール可能です。

https://ffmpeg.org/

そのほかにはストリーミング再生したい動画ファイルを用意してください。 (ここでは `video.mp4` とします)

以下のコマンドで、video.mp4 を video.m3u8 ファイルと、video001.ts などという名前のセグメントファイルを生成できます。

```
ffmpeg -i video.mp4 -c:v copy -c:a copy -f hls -hls_time 9 -hls_playlist_type vod -hls_segment_filename "video%3d.ts" video.m3u8
```

上述のコマンドを実行すると以下のようなファイルが生成されます。

```
video.m3u8
video.mp4
video000.ts
video001.ts
video002.ts
video003.ts
video004.ts
video005.ts
video006.ts
...
..
.
```

`video.m3u8` ファイルは以下のような形式になっています。

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD
#EXTINF:9.843167,
video000.ts
#EXTINF:8.708700,
video001.ts
#EXTINF:8.808800,
video002.ts
#EXTINF:9.142467,
video003.ts
#EXTINF:8.708700,
video004.ts
#EXTINF:9.676333,
video005.ts
#EXTINF:8.708700,
video006.ts
...
..
.
#EXT-X-ENDLIST
```

### ffmpeg コマンドについて

ffmpeg で動画変換するときの基本のフォーマットは以下の通りです。

```
ffmpeg -i video.mp4 video.m3u8
```

`-i` が入力ファイルを指定します。

その他のオプションについても簡単に説明します。

`-c:v copy` , `-c:a copy` は Audio や Video のコーデックを元の mp4 ファイルのものをそのまま使うように指定しています。\
`-f hls` で動画のフォーマットを、 `hls_time 9` で 9 秒ごとに `.ts` ファイルに分割するという指定をしています。\
`-hls_playlist_type vod` ではオンデマンド配信であることを、 `-hls_segment_filename "video%3d.ts"` で動画セグメントファイル名のフォーマットを指定しています。

詳細なコマンドライン引数に引数に関しては、こちらを参照してみてください。

https://ffmpeg.org/ffmpeg.html

これでストリーミング用のファイルができました。あとはこれを任意の Web サーバーなどにアップロードすれば動画配信をすることができます。
もちろん、ファイルを配置すれば良いので CloudFront などでキャッシュすることも可能です。

このファイルをローカルで再生するには、以下のコマンドを用います。

```
ffplay ./video.m3u8
```

これで動画プレイヤーが立ち上がり動画を再生することができます。

## まとめ

HLS の動画を mp4 ファイルから生成してストリーミング再生する方法を簡単にまとめました。\
この HLS の形式は動画ファイルを暗号化することも可能です。\
暗号化については、また別の機会にまとめようと思います。
