+++
date = "2019-10-06"
title = "iOSでEpubをダウンロードしてBookで開くサンプル実装"
thumbnail = ""
tags = ["ios", "swift", "Alamofire", "epub"]
categories = ["engineering"]
+++

こんにちは、最近サーバーサイドエンジニアに転向しかけている [kz_morita](https://twitter.com/kz_morita)です。\

今回は、Epub (Kindle とか電子書籍向けの拡張子) ファイルをダウンロードして、iPhone に標準で入っている Book アプリで開いて読むといったアプリのサンプル実装をしましたのでそのことについて簡単に書いていきます。

## 成果物

まずは成果物

{{< figure src="/images/posts/ios_epub_download_and_open_with_book/epub_download_sample.gif" >}}

ソースコードはこちらになります。

https://github.com/foresta/EpubDownloadSample

それでは、以降でソースコードについて簡単に説明していきます。

## Epub ファイルのダウンロード

今回、Epub ファイルのダウンロードには Alamofire を使用しました。

FileDownloader というクラスを作っていますのでそちらのコードを以下に載せます。

```swift

import Foundation
import Alamofire

class FileDownloader {

    static func download(url: URL, completion: @escaping (URL?, Error?) -> Void) {
        let filename = url.lastPathComponent
        let documentsURL = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask)[0]
        let fileURL = documentsURL.appendingPathComponent(filename)

        let destination: DownloadRequest.DownloadFileDestination = { _, _ in
            return (fileURL, [.removePreviousFile, .createIntermediateDirectories])
        }

        Alamofire.download(url, to: destination).response { response in
            if let error = response.error {
                completion(nil, error)
                return
            }

            if FileManager.default.fileExists(atPath: fileURL.path) {
                completion(fileURL, nil)
            } else {
                completion(nil, nil)
            }
        }
    }
}
```

やっていることは、Alamofire.download メソッドを用いてアプリ内に Epub ファイルを保存しています。download メソッドの completion でダウンロードしたファイルへのパスを返すことで Downloader の使用者側でファイルへアクセスできるようにしています。

## Book へ epub を送る

Book アプリへ Epub ファイルを送るために、UIDocumentInteractionController を使用しています。
Cell をタップした時に、Epub をダウンロードしているのでそのコードを以下に載せます。

```swift
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: false)

        Loader.show()
        FileDownloader.download(url: fileResources[indexPath.row].url) { [weak self] downloadUrl, error in
            guard let strongSelf = self else { return }

            Loader.hide()

            if let error = error {
                print("### Error Occured!!! \(error.localizedDescription))")
                return
            }

            guard let downloadUrl = downloadUrl else {
                print("### File not Downloaded!!!")
                return
            }

            strongSelf.documentController = UIDocumentInteractionController(url: downloadUrl)
            strongSelf.documentController?.presentOpenInMenu(from: strongSelf.view.frame, in: strongSelf.view, animated: true)
        }
    }
```

Downloader クラスでダウンロードするとファイルパスが取得できるので、そのパスを指定して、 `UIDocumentInteractionController` を生成します。
生成した documentController の presentOpenInMenu(from:in:animated) メソッドを呼ぶことでメニューを開いています。

注意点としては、documentController を ViewControler のメンバ変数として持たせておかないと、インスタンスが破棄されてしまうため期待通り動きません。

## まとめ

Epub をダウンロードして Book アプリでみるまでのコードを簡単に紹介しました。\
Apple が用意している機能を利用するのに関してはとても簡単に実現できてこれは iOS 開発の良いところだなと思いました。
