+++
title="QuickSight で環境を分離する際に役立ちそうな資料まとめ"
date="2024-07-28T19:32:04+09:00"
categories = ["engineering"]
tags = ["aws", "quicksight"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

AWS が提供する BI ツールである QuickSight にてマルチテナントなど環境を分離する際に参考になりそうな資料をまとめてみました。


## 資料まとめ

- {{< exlink href="https://aws.amazon.com/jp/blogs/news/amazon-quicksight-roadshow-tokyo2023/" text="【開催報告】Amazon QuickSight Roadshow 東京 2023" >}}

2023 年 8月に行われたイベントの報告レポートです。QuickSight の色々な機能について触れられています。

以下に上記イベントの中のプレゼン資料をいくつかピックアップします。

- {{< exlink href="https://pages.awscloud.com/rs/112-TZM-766/images/8_%E3%83%95%E3%82%A9%E3%83%AB%E3%82%BF%E3%82%99%E3%81%A8%20API%20%E3%82%92%E6%B4%BB%E7%94%A8%E3%81%97%E3%81%9F%E3%82%B7%E3%83%B3%E3%82%AF%E3%82%99%E3%83%AB%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E3%81%A6%E3%82%99%E3%81%AE%E8%A4%87%E6%95%B0%E7%92%B0%E5%A2%83%E9%81%8B%E7%94%A8.pdf" text="フォルダとAPIを活用したシングルアカウントでの複数環境運用" >}}

フォルダ機能を使って、複数環境を分離して運用する方法について書かれています。


- {{< exlink href="https://pages.awscloud.com/rs/112-TZM-766/images/7_QuickSight%20%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E3%82%A2%E3%82%BB%E3%83%83%E3%83%88%E7%AE%A1%E7%90%86.pdf" text="QuickSight におけるアセット管理" >}}

こちらは、QuickSight のアセットをコードで管理する方法について書かれています。
たとえば、開発環境と本番環境を用意している場合異なる環境間でアセットをコピーなどしてデプロイすると言った運用が考えられます。
その際に、アセットをコードとして管理されていると運用がしやすくなりそうです。

上記では Template 機能などが紹介されています。



---

- {{< exlink href="https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/namespaces.html" text="分離された名前空間によるマルチテナンシーのサポート" >}}

こちらは、公式サイトで QuickSight では名前空間を使って環境を分離する方法がサポートされていることについて説明されています。


- {{< exlink href="https://awsj-assets-qs.s3.ap-northeast-1.amazonaws.com/workshop/public/jp/01-introduction.html" text="Amazon QuickSight 埋め込みハンズオン > イントロダクション" >}}

こちらは、QuickSight の埋め込み機能を用いてマルチテナントのアプリケーションを作成するハンズオン資料です。
こちらも名前空間を使用して複数環境用意する例がハンズオン形式で紹介されています。

- {{< exlink href="https://dev.classmethod.jp/articles/quicksight-namespace-using-multitenant/" text="QuickSightの名前空間機能を使ってマルチテナント用に環境を分離させる" >}}

上記も名前空間機能を使ってマルチテナント用に環境を分離させる方法について書かれています。


- {{< exlink href="https://pages.awscloud.com/rs/112-TZM-766/images/11_SaaS%20%E3%81%A6%E3%82%99%20QuickSight%20%E3%82%92%E6%B4%BB%E7%94%A8%E3%81%99%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AE%E3%83%9B%E3%82%9A%E3%82%A4%E3%83%B3%E3%83%88%20%E3%80%9C%E8%A8%AD%E8%A8%88%E3%81%8B%E3%82%89%E9%81%8B%E7%94%A8%E3%81%BE%E3%81%A6%E3%82%99%E3%80%9C.pdf" text="SaaS で QuickSight を活用するためのポイント">}}

こちらは、QuickSight の 行レベルセキュリティなどの機能を使って、アクセス制御をする方法について書かれています。

## まとめ

今回は、QuickSight で環境を分離する際に役立ちそうな資料をまとめました。
名前空間やアセットのコード管理など環境を分離するために必要そうな機能がいくつか用意されているため、必要に応じてこれらを用いて運用していくのが良さそうだと思います。
