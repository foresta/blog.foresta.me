+++
title="『Understanding ETL』を読んだ"
date="2025-08-03T22:55:26+09:00"
categories = ["engineering"]
tags = ["book", "data-engineering", "etl"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、{{< exlink href="https://learning.oreilly.com/library/view/etlnoli-jie/9798341649804/" text="Understanding ETL" >}}を読みましたので感想など書いていきます。


## 書籍について


『{{< exlink href="https://learning.oreilly.com/library/view/etlnoli-jie/9798341649804/" text="Understanding ETL" >}}』は、ETL（Extract, Transform, Load）に関する基礎から実践までを網羅した書籍です。ETLの概念、設計、実装、運用に至るまで、幅広いトピックが扱われています。

O'Reilly Media 上で翻訳された内容を読みました。

以下のような目次になっています。

```
はじめに
1.データの取り込み
2.データ変換
3.データ・オーケストレーション
4.パイプラインの問題とトラブルシューティング
5.効率性と拡張性
結論
著者について
```

## 感想など

現在の仕事で データ取り込みについて課題を感じていたこともあり良さそうな本だったため読みました。

内容は、ETLの基本的な概念に加えて、実際に現在主流のETLのサービスなど幅広く知れるためよかったです。

- https://meltano.com/
- https://www.stitchdata.com/
- https://www.singer.io/
- https://dlthub.com/

dlt は現在 Dagster と組み合わせて使用していたりしましたが、他の選択肢も幅広くしれてよかったです。

他にもデータパイプラインの監視の話など運用していて、なかなか手が回っていない部分などの重要性についてあらため再認識よかったです。

データ取り込み処理を実装している開発者にとって一度目を通しておくと設計の選択肢が増えるためとてもいい本だなと思いました。
