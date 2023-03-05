+++
title="cli から数GB のファイルをダウンロードする"
date="2023-03-05T19:11:11+09:00"
categories = ["engineering"]
tags = ["cli", "rust"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、数GB のファイルをダウンロードする必要があり、curl などを叩いたりしたのですがうまくいかずにエラーになったりしたのでその解決方法についてメモします。

## 結論

既存の CLI ツールでうまく動かなかったため、Rust でファイルをダウンロードするコードを書きました。

- {{< exlink href="https://github.com/foresta/file-downloader/" >}}

結果として、2GB ほどあるファイルをダウンロードうまくすることができました。

## 試してできなかったこと

まずは、普通に curl コマンドでファイルをダウンロードしようとしました。
すると以下のようなエラーが出ました。

```bash
curl -O https://example.com/large-file.xml

curl: (92) HTTP/2 stream 0 was not closed cleanly: INTERNAL_ERROR (err 2)
```

エラーの詳細まで立ち入ってないのですが、毎回 1 GB ダウンロード完了下くらいの時点でエラーがでていたため、おそらく制限があるのではないかと思います。

次に、curl のコマンドで、ダウンロードを継続してやる方法について調べたので実行しました。

curl のオプションに `-C` というものがありこれを使うとダウンロードを継続して実行してくれるとのことなので試してみました。

```bash
curl -OC - --retry 999 --retry-connrefused --retry-max-time 0 http://example.com/large-file.xml
```

これを試したところ、こちらも同様の結果となり、1GB 超えた際にエラーになりました。

そのため、自前でコード書けばまぁうまくできるかなぁと軽い考えで Rust で downloader を書き始めました。

## コードをさっと説明

Rust でコードを書いたので軽く説明します。書きなぐったコードなのでもうちょっとやりたいことあるのですが一旦動いたので GitHub にアップしました。

- {{< exlink href="https://github.com/foresta/file-downloader" >}}

使用したライブラリは以下のような感じです。

##### Cargo.toml

```toml
[package]
name = "file-downloader"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
reqwest = { version = "0.11", features=["stream"]}
tokio = { version = "1.26.0", features=["fs", "full"]}
anyhow = "1.0.69"
futures = "0.3.26"
pbr = "1.1.1"
```

##### main

```rs
#[tokio::main]
async fn main() {
    let url = "https://blog.foresta.me/404.html";
    let filename = "blog-404.html";

    if let Err(e) = download_file(url, filename).await {
        println!("Error occurred: {:?}", e);
    } else {
        println!("Download Successfly!");
    }
}
```

main の処理は `download_file` 関数を呼び出してるだけですね。URL と filename は main 関数内で指定してますがこちらはコマンド引数とかにしたいですね。

##### download_file

```rs
async fn download_file(url: &str, filepath: &str) -> Result<()> {
    println!("Download Started: {}", url);

    let client = reqwest::Client::new();

    // send HEAD request for get content-length
    let content_length = get_content_length(&client, url).await?;

    // create file
    let mut file = tokio::fs::File::create(filepath).await?;

    // Initialize progressBar
    let mut pb = ProgressBar::new(content_length);
    pb.set_units(Units::Bytes);
    pb.set_width(Some(100));

    // send GET request for download
    let mut stream = client.get(url).send().await?.bytes_stream();
    while let Some(chunk_result) = stream.next().await {
        let chunk = &chunk_result?;

        // update progress bar
        pb.add(chunk.len() as u64);

        // write to file
        file.write_all(&chunk).await?;
    }
    
    file.flush().await?;

    println!("Download Finished: to {}", filepath);

    Ok(())
}
```

こちらは、url と filepath を受け取って、実際にダウンロードをしてます。
ダウンロード処理は以下の箇所で、{{< exlink href="https://crates.io/crates/reqwest" text="reqwest" >}} crate の client の get を呼び出してます。
そして、`bytes_stream()` メソッドを呼ぶことで、stream 化してすこしずつfile に書き込んで行きました。

```rs
    let mut stream = client.get(url).send().await?.bytes_stream();
    while let Some(chunk_result) = stream.next().await {
        let chunk = &chunk_result?;

        // update progress bar
        pb.add(chunk.len() as u64);

        // write to file
        file.write_all(&chunk).await?;
    }
```

また、進捗を表示したかったので、まず HEAD リクエストを投げて Response Header から `content-length` を取得してそれを filesize としています。
pbr というcrate がターミナル上での ProgressBar をいい感じに表示してくれそうだったのでこちらを使用しました。とても便利です。

- {{< exlink href="https://crates.io/crates/pbr" >}}

## まとめ

今回は、大きいファイルをダウンロードするために、Rust でコードを書いた際のメモを書きました。
このようなちょっとした CLI コマンドをつくるのに、Rust は非常に便利だと実感しました。
使用するライブラリ周りでちょっと調査が必要でしたが、意外とサクッと実装できよかったです。

こういった、ちょっとしたスクリプトから徐々に Rust を導入できたらいいなと思ったりしました。
