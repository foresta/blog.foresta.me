+++
title="BigQuery の料金プランについての下調べ"
date="2024-03-31T02:57:54+09:00"
categories = ["engineering"]
tags = ["bigquery", "gcp"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

BigQuery はいままでちゃんと触ったことがなかったのですが、使用する機会がありそうだったので、料金について調べたまとめです。

## 料金体系

まず大きく分けて、以下の２つがあります。

- ストレージ料金
- コンピューティング料金

コンピューティング料金のほうがいくつかプランがあり検討する必要があります。

それぞれ見ていきます。

### ストレージ料金

ストレージ料金は、BigQuery へデータを保存するのにかかる費用です。

無料枠として、毎月 10 GiB まで利用できます。

ストレージには、アクティブストレージと、長期保存用のストレージがありそれぞれ価格が違います。

また課金対象を論理バイトにするか、物理バイトにするかも変更することができるようです。
物理バイトは、最適化などがされたあとのバイト数なので料金が安くなることもありそうです。
（利用には条件がありそうです。）

料金は 2024/03/31 時点で以下の用になっています。(asia-northeast1 Region)
以下はすべ 1 月あたりの金額です

- Active logical storage: $0.023 per GiB
- Long-term logical storage: $0.016 per GiB
- Active physical storage: $0.052 per GiB
- Long-term physical storage: $0.026 per GiB

くわしくは以下公式サイトを参照してください

- {{< exlink href="https://cloud.google.com/bigquery/pricing#storage" >}}

### コンピューティング料金

コンピューティング料金は大別して以下の２種類があります。

- オンデマンド料金
- 容量の料金 (スロット時間単位)

オンデマンド料金は、クエリによりスキャンされたデータに対して課金がされるものです。
無料枠として 1TiB が利用できます。
できます

一方で、容量の料金については処理されたバイト数ではなく、スロットと呼ばれる仮想 CPU 単位で課金がされます。
BigQuery がクエリのサイズや複雑さに応じてクエリ実行に必要なスロット数が自動的に計算され消費されます。

- {{< exlink href="https://cloud.google.com/bigquery/docs/slots?hl=ja" text="スロットについて">}}

スロット時間単位による課金は、`BigQuery Editions` と呼ばれる料金体系となっています。
BigQuery Editions には以下のプランが用意されています。

- Standard
- Enterprise
- Enterprise Plus

そのため、コンピューティング料金は上記の 3 プランにオンデマンド料金を加えた 4 プランの中から選択することになります。

それぞれのプランでできること、できないことがありこちらは公式サイトで表にまとまっています。

- {{< exlink href="https://cloud.google.com/bigquery/docs/editions-intro?hl=ja#editions_features" >}}

自分が気になる点としては、BigQuery DCR の利用 (subscription) が `Enterprise plus` plan しか対応してなかったりします。

(英語版のドキュメントだと、On-demand も DCR 使えるみたいな表記になっていたのでどちらが正しいかは要確認です。)

### スロットについて

BigQuery ではスロットについて、Reservation と Commitment という概念があります。

容量ベースのコンピューティング料金の場合、予約 (Reservation) するスロットを明示的に選択して購入するような料金プランになっています。

購入する際に、Commitment プランと呼ばれ 1 年間もしくは 3 年間まとめて変えるプランもあります。
こちらは、まとめて買うとお得になるプランといった感じで任意です。


また、スロットを自動でスケーリングするような設定にすることもできるそうです。

- {{< exlink href="https://cloud.google.com/bigquery/docs/slots-autoscaling-intro?hl=ja" >}}

公式でスロット見積もりツールがあるのでそちらを参考にするとよさそうです。



また、以下の記事でどのようにコンピューティング料金のプランを選択したらよいのかのフローチャートが記載されていたので参考にしてみてください。

- {{< exlink href="https://medium.com/@bjmla2021/bigquery-cost-optimization-best-practices-flat-rate-vs-on-demand-vs-new-bigquery-editions-3d66b2bce1dc" >}}

とりあえず試しで使ってみるくらいで、月に 1 TiB 未満であれば、とりあえず On-demand を使ってみるのが良さそうかなと思いました。

定期的なバッチ処理など、ワークロードがある程度みえてきたら BigQuery Editions の検討をするのがよさそうです。

## まとめ

BigQuery の料金プランについて下調べした内容を書きました。
基本的には公式ドキュメントをみるとわかりますが、この手の Cloud SaaS の料金プランは分かりづらいことが多いけど一歩間違うと高額に請求されてしまう可能性もあるため、慎重にしらべなければならないです。

下調べはしてざっくりわかったので実際に触ってみようと思います。

## 参考

- {{< exlink href="https://cloud.google.com/bigquery/docs/?hl=ja">}}
- {{< exlink href="https://blog.g-gen.co.jp/entry/bigquery-editions-explained" >}}
- {{< exlink href="https://developers.bookwalker.jp/entry/2023/06/21/104946" >}}
- {{< exlink href="https://medium.com/@bjmla2021/bigquery-cost-optimization-best-practices-flat-rate-vs-on-demand-vs-new-bigquery-editions-3d66b2bce1dc" >}}

