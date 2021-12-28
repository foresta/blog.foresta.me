+++
title="word cloud で 2021 年のブログを振り返る"
date="2021-12-28T11:38:37+09:00"
categories = ["engineering"]
tags = ["blog", "word_cloud"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今年も無事週一でブログを書き続けることができたので、今年のブログの内容を word cloud で振り返ってみます。

今年は、どうやら 52 本の記事を書いていたようです。

## word cloud で振り返る

手法は、去年と同じなので、よかったら参考にしてみてください。

- [word cloud で今年のブログを振り返る](/posts/looking_back_on_2019th_blog_in_word_cloud/)

早速 wordcloud の結果を見てみます。

{{< figure src="/images/posts/looking_back_on_2021th_blog_in_word_cloud/wordcloud.png" >}}

目立つのは、`データ`, `scala`, `lambda`, `関数` あたりでしょうか。

データ関連で言うと、以下のような記事を書きました。

- [Redshift 分析のための Window 関数まとめ](/posts/redhift-window-function/)
- [Google Colaboratory で Google Drive 上のファイルを読み込む](/posts/colab-mount-google-drive/)
- [さまざまなデータベースの分類について](/posts/database-map/)
- [データベースのデータレイアウトについて](/posts/database-data-layout/)
- [Apache Lucene の Index の仕組みを探る](/posts/read-apache-lucene-index/)

scala 関連は開発環境の構築と入門記事を書きました。

- [Java を jenv を使って環境構築する](/posts/setup_java_with_jenv/)
- [Scala と IntelliJ で開発環境のセットアップ](/posts/setup_scala/)
- [M1 Mac に sbt を入れて Scala 3 の REPL を使用する](/posts/scala-sbt-repl/)
- [Scala入門 その1 基本型とリテラル](/posts/scala-intro-1/)
- [Scala 入門 その2 制御構文](/posts/scala-intro-2/)
- [Scala入門 その3 クラスとオブジェクト](/posts/scala-intro-3/)
- [Scala入門 その4 トレイト](/posts/scala-intro-4/)
- [Scala入門 その5 関数とクロージャ](/posts/scala-intro-5/)
- [Scala入門 その6 コレクション操作](/posts/scala-intro-6/)
- [Scala入門 その7 テスト](/posts/scala-intro-7/)

lambda はおそらく AWS 関連の話だと思います。AWS関連は以下のような記事を書きました。

- [ブログをさくらVPSからS3+CloudFrontに移行した](/posts/migrate_blog_to_aws/)
- [AWS Lambda と Parameter Store の環境を CDK で構築する](/posts/lambda-parameter-store-cdk/)
- [Redshift 分析のための Window 関数まとめ](/posts/redhift-window-function/)
- [ブログをAWS の CodePipeline でデプロイする](/posts/blog-deploy-pipeline/)
- [AWS CodeDeploy の hooks から lambda を実行する](/posts/codedeploy-hooks-lambda/)
- [Amazon Athena でデータの統計量を表示する SQL を書く](/posts/presto_display_statistics/)

## まとめ

今年は、転職をしたこともあって新しく Scala 周りの記事を書いたりデータ周りの話を書いたりすることが多かったみたいです。

また今までの経験であまり深く関わってこなかった技術や知識についてブログを多く書いていました。データ周りやインフラ (AWS) 周りはこれからもしっかりキャッチアップしていきたい分野なので引き続きブログは書き続けていく予定です。

今年で 3 年間ブログを週一で書いてきたことになりますが、アウトプットとしてもある程度残せたのと新しいインプットも意識して行えたのでよかったです。
来年も頑張りたいなと思います。
