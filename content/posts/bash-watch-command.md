+++
title="watch コマンドを使って API を一定間隔で叩きレイテンシーを確認する"
date="2022-10-15T03:02:16+09:00"
categories = ["engineering"]
tags = ["linux", "bash", "watch"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

curl で一定間隔おきに API を叩いてレイテンシーを確認したいといったときに、`watch` コマンドをつかうと便利だったのでメモです。

## ワンライナー

先に結論です。
特定の API を一定間隔で叩きレイテンシーを CSV に書き出すためには以下のようなワンライナーで実現できます。

```bash
$ echo '"http_code", "time_total"' > result.csv && watch -n 1 'curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv'
```

以下のような CSV ファイルを吐き出すことができます。

```
"http_code", "time_total"
200, 0.000691
200, 0.000557
200, 0.000604
200, 0.000708
200, 0.000751
200, 0.000678
```

watch コマンド便利ですね。

以下上記のコマンドについて順を追って説明していきます。

## APIを叩いてレイテンシーを確認する

例えば localhost:8080 に対してリクエストをしたいといったときには、以下のように Curl を用いるかと思います。

```bash
$ curl localhsot:8080
```

レイテンシーを計測する際には、以下のように結果を破棄しつつ、-w コマンドでAPIから結果が返却されるまでの時間を取得することができます。

```bash
$ curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n"
```

結果を破棄するには `-o /dev/null` で。

`-w` コマンドを用いるといろいろなパラメータが見れます。

使用できるパラメータを確認するには、`man curl` で見れるドキュメントの中を `--write-out` などで検索するとよさそうです。

以下がパラメータ一覧です。

- content_type
- filename_effective
- ftp_entry_path
- http_code
- http_connect
- local_ip
- local_port
- num_connects
- num_redirects
- proxy_ssl_verify_result
- redirect_url
- remote_ip
- remote_port
- scheme
- size_download
- size_header
- size_request
- size_uploard
- speed_download
- speed_upload
- ssl_verify_result
- stderr
- stdout
- time_appconnect
- time_connect
- time_namelookup
- time_pretransfer
- time_redirect
- time_starttransfer
- time_total
- url_effective

今回は、HTTP のステータスコードと、APIのレスポンスが返却されるまでの時間を確認するために、`%{http_code}` と `%{time_total}` を見てみました。

## 複数回叩いて結果をCSVに書いてみる

結果をCSV として書くには以下のように複数回実行して　csv ファイルにリダイレクトして書き出せばよいです。

```bash
$ curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv
$ curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv
$ curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv
```

ヘッダが欲しければ以下のようにしてもよいでしょう。

```bash
$ echo '"http_code", "time_total"' > result.csv
$ curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv
$ curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv
$ curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv
```

以下のようなファイルができると思います。

```
"http_code", "time_total"
200, 0.000608
200, 0.000687
200, 0.000673
```

## 1 秒おきに API を叩いて結果を CSV に書き出す。

さていよいよ本題の `watch` コマンドです。
n 秒おきにコマンドを実行するに使えます。

`-n` オプションに n 秒おきの秒数を指定でき、`-n 0.5` などとすれば 0.5 秒おきを指定できます。

試しに、`watch -n 1 ls` と実行すると 1 秒おきに ls コマンドがたたかれます。Ctrl+C で watch コマンドを終了できます。
ls コマンドの結果をファイルに書いてみると定期的にたたかれている様子がわかりやすいです。 

このコマンドを用いて、1 秒おきに API を叩くには以下のようにします。

```bash
$ watch -n 1 'curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv'
```
コマンド部分がスペースが混じる場合は、上記のようにクオーテーションでくくればOKです。


しばらく待ってから　Ctrl+C で終了すると以下のような CSV ファイルを作ることができます。

```
200, 0.000700
200, 0.000576
200, 0.000681
200, 0.000697
200, 0.000641
200, 0.001992
200, 0.000663
```

ヘッダがほしければ以下のようにするとよいでしょう。

```bash
$ echo '"http_code", "time_total"' > result.csv && watch -n 1 'curl -s localhost:8080 -o /dev/null -w "%{http_code}, %{time_total}\n" >> result.csv'
```

```
"http_code", "time_total"
200, 0.000691
200, 0.000557
200, 0.000604
200, 0.000708
200, 0.000751
200, 0.000678
```

あとは、このCSVを解析すればグラフ化したり、いろいろなことができそうです。

## まとめ

今回は、linux の watch コマンドと curl を用いて、一定間隔おきに API を叩いてレイテンシーを確認する方法をまとめました。
watch コマンド便利なので一定間隔で実行したい処理や、特定のリソースを監視したい場合などに使用できるかと思います。

意外と知らないけど便利なコマンドあるので、調べてみるといろんな発見があって面白いと思います。