+++
categories = ["engineering"]
date = "2019-08-25"
title = "ffmpeg を使って mp4 を 暗号化されたHLS を生成する"
thumbnail = ""
tags = ["hls", "ffmpeg", "mp4", "encrypt", "aes-128"]
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita">}} です。

[前回](/posts/convert_mp4_to_hls_with_ffmpeg) の記事では、ffmpeg を用いて HLS 動画を作成するところまでを紹介しました。\
今回はその続編ということで、HLS の動画を暗号化する方法についてまとめていきます。

## HLS の暗号化の手順

HLS 動画を暗号化するためには、プレイリストファイル (.m3u8) に以下のように記述を追加する必要があります。

```
#EXT-X-KEY:METHOD=AES-128,URI="https://api.example.com/encryptkey",IV=0x000000000000000000000000000000
```

プレイリストファイルでは、 `#EXT` で始まるものはタグとして認識されます。\
HLS を暗号化するためには、メディアセグメント (.ts) ファイルを暗号化しその復号鍵を `#EXT-X-KEY` 指定する必要があります。

上記のタグを説明すると、 `METHOD` には暗号化の方法 (上記では AES-128 で暗号化) を, `URI` には鍵ファイルの場所を指定します。 `IV` は Initialization Vector つまり初期化ベクトルのことです。AES-128 で暗号をかけるときに使用します。

EXT-X-KEY が記述された プレイリストファイルも前回同様 ffmpeg 生成することができます。

手順としては以下のように進めていきます。

1. 暗号鍵の生成
2. IV の生成
3. ffmpeg を用いて暗号化された HLS を生成する

暗号化の方式は、AES-128 にしていきます。

## 暗号鍵の生成

暗号鍵の生成は、 `openssl` コマンドを使用します。
AES-128 は 128bit (オクテット) の鍵を使用するため、以下のコマンドで 16 バイトの鍵を生成します。

```
$ openssl rand 16 > video.key
```

鍵ファイルは video.key という名前で保存することにします。

## IV の生成

AES-128 で使用する IV は暗号鍵と同様 16 バイトになります。
こちらも `openssl` コマンドで生成します。

```
$ openssl rand -hex 16
abcdef0123456789abcdef0123456789
```

こちらはこのあと使用するのでメモしておきましょう。

## ffmpeg を用いて暗号化された HLS を生成する

ffmpeg を用いて暗号化された HLS を生成するさいには、暗号化に関する情報を記述したファイルを作成する必要があります。

今回はそのファイルを `video.keyinfo` というファイルとします。

video.keyinfo の中身は以下のような構成にします。

```
Key URI
Path to key file
IV (任意)
```

1 行目には先ほど説明した m3u8 ファイルの `#EXT-X-KEY` に記載する URI を記入します。こちらは鍵を複合して再生するときに使用されます。
2 行目には先ほど生成した鍵ファイルへのパスをしていします。こちらは ts ファイルを暗号化するのに使用します。
3 行目には `#EXT-X-KEY` に記載する IV を指定します。IV は任意の項目です。

ローカルで確認する分には以下のようなファイルでも問題はないです。

```
video.key
video.key
```

それでは実際に暗号化された HLS ファイルを生成してみます。HLS 動画の生成には以下のコマンドを使用します。

```
$ ffmpeg -i video.mp4 -c:v copy -c:a copy -f hls -hls_key_info_file video.keyinfo -hls_time 9 -hls_playlist_type vod -hls_segment_filename "video%3d.ts" video.m3u8
```

前回の記事との変更点としては、 `-hls_key_info_file video.keyinfo` というオプションが追加されています。
これを指定することで、実際に暗号化された HLS を作成することができます。

## まとめ

今回はローカルで ffmpeg を利用して AES-128 で暗号化された HLS 動画を生成する方法についてまとめました。
実際の運用では、AWS の Media Convert などを利用して暗号化された動画ファイルを生成することもできます。
そのときに必要なのも、今回紹介した暗号鍵や IV なので一回ローカルで試してみると良いのではないかと思います。
