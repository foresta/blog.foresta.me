+++
title="Docker の エラーと additonal_contexts について"
date="2024-06-02T17:25:45+09:00"
categories = ["eingineering"]
tags = ["docker", "additional_contexts"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段 Docker を用いて開発環境を構築していますが、以下のようなエラーが発生しました。

```
{services名} Additional property additional_contexts is not allowed
```


今回はこのエラーの解消方法についてまとめていきます。


## エラーの解消

今回は以下のような docker-compose.yml ファイルでエラーが発生しました。

あくまで一例です。

```yaml
version: '3'

x-hoge: &hoge
  additional_contexts:
    - hoge=/path/to/hoge/

services:
  python:
    build:
      context: .
      <<: *hoge
    volumes:
      - .:/app:sample_app
   ports:
      - "8080:8080"
      - "8888:8888"
    environment:
      <<: *environment
```


エラー内容をみると、`addtional_contexts` というプロパティが存在しないために発生していました。

(再掲)
```
{services名} Additional property additional_contexts is not allowed
```

公式サイトをみると、additonal_contexts は Docker の 2.17.0 に追加された機能で、それ以前のバージョンを使っている人がエラーになっていることがわかったのでアップデートをしてもらって解決しました。
 
- {{< exlink href="https://docs.docker.com/compose/compose-file/build/#additional_context" text="Compose Build Specification | Docker Docs">}}

## additional_contexts とは 

additional_contexts プロパティを使用すると、Docker Image をビルドする際に名前付きのコンテキスト情報を定義することができます。

今回は Dockerfile 側が以下のようになっていました。

```
FROM python:3.9-slim

WORKDIR /app

COPY --from=hoge hogefile.txt /hoge/

COPY requirements.txt .
RUN pip install -r requirements.txt
```

hoge という名前付きのコンテキストを docker-compose.yml から渡していて、Dockerfile 側で以下のように利用しています。

```
COPY --from=hoge hogefile.txt /hoge/
```

COPYコマンド実行時にで `--from=hoge` とすることで `/path/to/hoge` ディレクトリ以下というコンテキスト情報を持った状態で実行でき、結果として hogefile.txt をコンテナ内の /hoge/ にコピーするといったことが実現できます。


## まとめ

今回は、Docker のエラーとその解消方法についてまとめてみました。
また、additional_contexts というプロパティについても簡単に説明しました。

実際に additonal_contexts を使ってみるととても便利でした。
あまり追いきれてないですが一度 Release Note などをチェックしてみると新たな発見などありそうなので調べてみようと思いました。
