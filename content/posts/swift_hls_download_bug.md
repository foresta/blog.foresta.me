+++
categories = ["engineering"]
date = "2019-05-11"
title = "iOSのHLSダウロードとaggregateAssetDownloadTaskのassetTitleのバグについて"
thumbnail = ""
tags = ["ios", "swift", "hls", "download"]
+++

こんにちは、iOS エンジニアとして Swift を書いている{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita">}} です。

今回は iOS で動画ダウンロード機能を実装したときにハマったことについて書いていこうと思います。

## TL;DR

- HLS は Apple が提唱した動画配信用のプロトコル
- HLS の動画もダウンロードすることができる
- Apple の {{< exlink href="https://developer.apple.com/documentation/avfoundation/media_assets_playback_and_editing/using_avfoundation_to_play_and_persist_http_live_streams" text="サンプルコード" >}}がある
- {{< exlink href="https://developer.apple.com/documentation/avfoundation/avassetdownloadurlsession/2897242-aggregateassetdownloadtask" text="aggregateAssetDownloadTask" >}}の assetTitle にマルチバイトを指定するとダウンロードできないケースがある

## Http Live Streaming 動画を iOS アプリからダウンロードする

### HLS とはなにか?

Http Live Streaming (HLS) とは、Apple から提唱された動画配信の仕組みでその名の通り動画のストリーミング再生に特化した動画配信技術です。

以下のような特徴があります。

- HTTP サーバーを利用できる (CDN つかえる)
- Live 放送 / Ondemand 放送 の両方に対応している
- 帯域に応じて最適なストリームに切り替えられる
- HTTPS を使用して暗号化とユーザ認証ができる

とくに最初の HTTP サーバーで配信することができるため、手軽に動画を配信することができるのが特徴です。

くわしくは以下のリンクを参照ください \
{{< exlink href="https://developer.apple.com/streaming/" >}}

### HLS をダウンロードする

HLS はストリーミング用のプロトコルで、 `.m3u8` という拡張子をもった以下のファイルと、実際の動画をセグメントに分割した `.ts` ファイルが必要となります。

Apple の AVFoundation には、`.m3u8` ファイルの URL を指定してダウンロードをする実装が用意されていて、そのサンプルコードも Apple が用意してくれているので、今回はこのファイルを元に説明していきます。

サンプルコードは以下からダウンロードできます。

{{< exlink href="https://developer.apple.com/documentation/avfoundation/media_assets_playback_and_editing/using_avfoundation_to_play_and_persist_http_live_streams" text="Using AVFoundation to Play and Persist HTTP Live Streams">}}

その中でも、とくにダウンロード周りの機能が実装されている、AssetPersistenceManager についてみていきます。

必要そうなとこだけ、抜粋して下記に記載します。

```swift
class AssetPersistenceManager: NSObject {

    override private init() {
        super.init()

        // 1. backgroundでダウンロードするための設定と、URLSessionの初期化
        let backgroundConfiguration = URLSessionConfiguration.background(withIdentifier: "AAPL-Identifier")
        assetDownloadURLSession =
            AVAssetDownloadURLSession(configuration: backgroundConfiguration,
                                      assetDownloadDelegate: self, delegateQueue: OperationQueue.main)

    }

    // ストリームをダウンロードする
    func downloadStream(for asset: Asset) {

        // 2. ダウンロードタスクの生成
        let preferredMediaSelection = asset.urlAsset.preferredMediaSelection
        guard let task =
            assetDownloadURLSession.aggregateAssetDownloadTask(with: asset.urlAsset,
                                                               mediaSelections: [preferredMediaSelection],
                                                               assetTitle: asset.stream.name,
                                                               assetArtworkData: nil,
                                                               options:
                [AVAssetDownloadTaskMinimumRequiredMediaBitrateKey: 265_000]) else { return }

        // 3. タスク実行
        task.taskDescription = asset.stream.name
        task.resume()
    }
}

// AVAssetDownloadDelegate
extension AssetPersistenceManager: AVAssetDownloadDelegate {

    // タスクのデータ転送が終了したときにcall
    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {

        // ダウンロードエラーチェックや、ファイル保存などを行う
    }

    // 一括ダウンロードタスクによって、ダウンロード先のPathが決定sれた時にCall
    func urlSession(_ session: URLSession, aggregateAssetDownloadTask: AVAggregateAssetDownloadTask,
                    willDownloadTo location: URL) {

        // 上記 didCompleteWithError で参照できるようにダウンロード先Pathを保持する
    }

    // 子タスクの終了時に呼ばれる
    func urlSession(_ session: URLSession, aggregateAssetDownloadTask: AVAggregateAssetDownloadTask,
                    didCompleteFor mediaSelection: AVMediaSelection) {

        // 続けてタスク実行させる
        aggregateAssetDownloadTask.resume()
    }

    // タスクの進行状況をsubscribeするためのmethod
    func urlSession(_ session: URLSession, aggregateAssetDownloadTask: AVAggregateAssetDownloadTask,
                    didLoad timeRange: CMTimeRange, totalTimeRangesLoaded loadedTimeRanges: [NSValue],
                    timeRangeExpectedToLoad: CMTimeRange, for mediaSelection: AVMediaSelection) {
        // progress bar の更新などのために、進捗を通知する
    }
}

```

基本的には下記のながれで処理が進みます。

1. URLSession の初期化
2. ダウンロードタスクの生成
3. タスクの実行
4. AVAssetDownloadDelegate の各メソッドが順番によばれる

ダウンロードが完了すると、 `hogehoge.movpkg` というディレクトリがダウンロードされています。

再生するときは、このファイルへのパスを指定して以下のようにすればダウンロードした Asset を再生することができます。

```swift
let downloadFilePath = "hogehoge/movie.movpkg"
let urlAsset = AVURLAsset(url: downloadFilePath)
if urlAsset.isPlayable {
    self.playerItem = AVPlayerItem(asset: urlAsset)
}
self.avPlayer.replaceCurrentItem(with: self.playerItem)
```

### 参考にしたサイト

- {{< exlink href="https://developer.apple.com/streaming/" >}}
- {{< exlink href="https://developer.apple.com/documentation/avfoundation/media_assets_playback_and_editing/using_avfoundation_to_play_and_persist_http_live_streams" text="Using AVFoundation to Play and Persist HTTP Live Streams" >}}
- {{< exlink href="https://www.slideshare.net/yuujihato/iosdc-2018-112400328" text="iOSDC 2018 動画をなめらかに動かす技術" >}}
- {{< exlink href="https://devstreaming-cdn.apple.com/videos/wwdc/2016/504m956dgg4hlw2uez9/504/504_whats_new_in_http_live_streaming.pdf" text="What's New in HTTP Live Streaming" >}}

## マルチバイト文字を assetTitle に指定するとダウンロードできないケースがある。

上記までの方法でなんとか動画ダウンロードまでできたのですが、いくつかの動画でなぜかダウンロードできないという現象がおきました。

結論から書くと、aggregateAssetDownloadTask でダウンロードタスクを生成するときに、引数 `assetTitle` に `26文字以上のマルチバイト文字` をいれるとダウンロードに失敗します。

```swift
let task =
            assetDownloadURLSession.aggregateAssetDownloadTask(with: asset.urlAsset,
                                                               mediaSelections: [preferredMediaSelection],
                                                               assetTitle: asset.stream.name, // <= ここ！！
                                                               assetArtworkData: nil,
                                                               options:
                [AVAssetDownloadTaskMinimumRequiredMediaBitrateKey: 265_000])
```

以下調査した文字たちです。

```
失敗ケース
ああああああああああああああああああああああああああ
ああああああああああああああああああああああああああa

成功ケース
あああああああああああああああああああああああああ
あああああああああああああああああああああああああa
あああああああああああああああああああああああああaaa
```

おそらくこれは AVFoundation のバグなんじゃないかなーと思ってます。

## まとめ

ストリーミング用のプロトコルである HLS のプレイリスト用のファイル m3u8 を用いて動画をダウンロードする実装について簡単に説明しました。

iOS の AVFoundation にも標準で HLS をダウンロードする機能があるのでそれを用いるとストリーミングだけでなく、動画ダウンロードまで実装することができました。

途中いくつかハマったり思わぬバグに出会ったりして大変でしたが目的のダウンロード昨日は実現できたのでよかったです。
