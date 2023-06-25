+++
title="Apache Flink を Docker で試す"
date="2023-06-25T22:44:15+09:00"
categories = ["engineering"]
tags = ["flink", "apache-flink", "docker"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、{{< exlink href="https://nightlies.apache.org/flink/flink-docs-master/" text="Apache Flink" >}} を試してみるのにあたって、docker の環境を作ってサンプルを実行してみたのでそのメモです。


いかに docker-compose ファイルとかをコミットしてあるので良ければ参考にしてみてください。
- {{< exlink href="https://github.com/foresta/flink-on-docker" >}}

## flink を動かす

flink は、stream 処理を実行するための framework です。

Docker で動かすために以下のページを参考にしました。

- {{< exlink href="https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/resource-providers/standalone/docker/" >}}

上記は、`docker run` コマンドでそれぞれ起動しているため、今回は docker-compose.yml ファイルを作成しました。

```yml
version: "3"

services:
  jobmanager:
    image: flink:latest
    container_name: flink-jobmanager
    ports:
      - "8081:8081"
    networks:
      - flink-network
    environment:
      FLINK_PROPERTIES: "jobmanager.rpc.address: jobmanager"
    command: jobmanager
    tty: true

  taskmanager:
    image: flink:latest
    container_name: flink-taskmanager
    networks:
      - flink-network
    environment:
      FLINK_PROPERTIES: "jobmanager.rpc.address: jobmanager"
    command: taskmanager
    tty: true

networks:
  flink-network:
```

上記は Flink の `jobmanager` と `taskmanager` を起動しています。それぞれを簡単に説明すると、`jobmanager` は Flink で実行したいジョブを管理するもので、実際に処理を行う worker node が `taskmanager` になります。 

{{< exlink href="https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/overview/#application-mode" text="公式ページのこちら" >}} がわかりやすいです。

ちなみに、`jobmanager` には、WebUI が用意されているため、`8081` ポートに接続できるようにしています。


上記の docker-compose ファイルを用意したら起動します。

```
$ docker-compose up -d 
```

起動すると、localhost:8081 で以下のような WebUI にアクセスできます。

{{< figure src="/images/posts/run-apache-flink-on-docker/webui.png" >}}


## Job を実行する

Flink が動いたので実際に Job を実行してみます。

Docker image の中にサンプルの .jar ファイルが入っているので今回は、`WordCount.jar` を実行してみます。

実行されてることが確認できるように、docker logs を実行しておきます。

新しく二つ terminal のタブを開いて実行するのがよさそうです。

```bash
$ docker logs -f flink-jobmanager
$ docker logs -f flink-taskmanager
```

`docker compose exec` で、ジョブを指定して実行します。

```
$ docker compose exec jobmanager ./bin/flink run ./examples/streaming/WordCount.jar
```

実行すると結果が表示されるのが確認できるかと思います。

WebUI からもログをみることができそうです。


{{< figure src="/images/posts/run-apache-flink-on-docker/webui-log.png" >}}

## まとめ

今回は、Apache Flink をローカルで試すために、docker-compose 周りの設定や、実際に Job の実行などを実施してみました。

docker-compose ファイル作っておくとサクッと環境作れるのでこういう新しいものを試すときには非常に便利だなと思いました。

