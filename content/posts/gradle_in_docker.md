+++
title="Kotlin の Gradle プロジェクトをコンテナ化する"
date="2020-03-15T18:51:32+09:00"
categories = ["engineering"]
tags = ["docker", "gradle", "kotlin"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Docker コンテナ内で gradle プロジェクトを動かすためにした設定などをまとめていこうと思います。

プロジェクト全体としては、Kotlin の API サーバーと MySQL を、Docker で動かすことを想定しています。

## プロジェクト構成

プロジェクト全体のディレクトリ構造は以下のようになっています。
(基本的な部分と説明に必要な部分のみ載せています。)

前提として[前回の記事](/posts/kotlin-multi-project/) で作成した マルチプロジェクトの Kotlin を想定しています。

```
.
├── build.gradle
├── docker
│   ├── Dockerfile.local
│   └── Dockerfile.mysql
├── docker-compose.yml
├── gradle/
├── gradlew
├── gradlew.bat
├── settings.gradle
├── sample-application
│   └── src
│       ├── main/kotlin/
│       └── test/kotlin/
├── sample-cli
│   └── src
│       ├── main/kotlin/
│       └── test/kotlin/
├── sample-domain
│   └── src
│       ├── main/kotlin/
│       └── test/kotlin/
├── sample-infrastructure
│   └── src
│       ├── main
│       │   ├── kotlin/
│       │   └── resources/
│       │       └── hibernate.cfg.xml
│       └── test
│           └── kotlin/
└── sample-web
    └── src
        ├── main/kotlin
        │   └── Main.kt
        └── test/kotlin/
```

## 設定ファイル

### Dockerfile.local

まずは Dockerfile の説明をしていきます。今回は、DockerHub から OpenJDK の 8u171 のバージョンを使用します。

```
FROM openjdk:8u171-jdk-alpine3.8

WORKDIR /usr/src/app

# build
COPY . .
RUN ./gradlew -Penv=local sample-web:classes
CMD ["./gradlew", "-Penv=local", "sample-web:exec"]
```

gradle で、 `sample-web:classes` で compile し class ファイルを作成した後に、sample-web:exec というタスクで実行しています。この `exec` は独自に設定したタスクなため以降で説明します。

### build.gradle

次に build.gradle のうち今回のコンテナ化に関連するところのみ以下の載せます。

```
project("sample-web") {
    dependencies {
        compile project(":sample-application")
    }
    task exec(type: JavaExec) {
        main = "org.example.web.Main"
        classpath = sourceSets.main.runtimeClasspath
    }
}
```

上記では Dockerfile 内の CMD で実行している、`sample-web:exec` を定義しています。
`JavaExec` という実行を行う type を指定し、main クラスを指定することで対象のコードを実行することができます。

### docker-compose.yml

ここまでで、Docker コンテナでビルドできるようになったので、docker-compose で mysql コンテナと通信ができるようにしていきます。

はじめに docker-compose.yml を以下に載せます。

```yml
version: '3'

services:
  sample_mysql:
    build:
      context: .
      dockerfile: ./docker/Dockerfile.mysql
    image: mysql
    command: mysqld --character-set-server=utf8mb4 --character-set-filesystem=utf8mb4
    ports:
      - '33306:3306'
    volumes:
      - mysql:/var/lib/mysql
    environment:
      MYSQL_DATABASE: sample
      MYSQL_ROOT_PASSWORD: hogehoge
      MYSQL_USER: sample-dev
      MYSQL_PASSWORD: sample-dev
    networks:
      - sample

  sample_api:
    build:
      context: .
      dockerfile: ./docker/Dockerfile.local
    image: sample_api
    ports:
      - '38080:8080'
    depends_on:
      - sample_mysql
    volumes:
      - .:/usr/src/app
    networks:
      - sample

volumes:
  sample_mysql:

networks: sample:
```

上記 yml ファイルでは、mysql と api の各サービスを指定しています。またコンテナ間で通信を行う必要があるため、sample という Docker Network を設定し、MySQL と API サーバーが 同一の sample ネットワークに属するように設定します。

API サーバーがコンテナ出ない場合は、localhost:33306 などで DB に接続できるのですがコンテナからコンテナへと通信をする場合には Network を作成する必要があります。

### hibernate.cfg.xml

上記でネットワークの設定をしたので、DB の設定ファイルに記述していきます。
今回は、O/R マッパーの hibernate を使用する想定のため以下のような xml ファイルを記述しています。

```xml
<?xml version='1.0' encoding='utf-8'?>
<!DOCTYPE hibernate-configuration PUBLIC
        "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
        "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
        ...
        <property name="hibernate.hikari.dataSource.url">jdbc:mysql://sample_mysql:3306/sample?useUnicode=true&amp;characterEncoding=UTF8&amp;autoReconnect=true&amp;useLegacyDatetimeCode=false</property>
        ...
    </session-factory>
</hibernate-configuration>
```

コンテナ間の通信のネットワークを docker-compose によって指定したので、docker-compose に指定した サービス名で DB に接続することができます。
以下のような、`sample_mysql:3306` というホスト名でつなぐことができます。

```
jdbc:mysql://sample_mysql:3306/sample
```

## まとめ

今回は簡単に、ローカルで docker-compose を利用して、API サーバーと DB サーバーを Docker コンテナ上で動かす方法についてまとめてみました。

なかなか環境構築を行う機会はすくないのですが、Docker の Network 設定など知らなくてハマったりしたので環境構築はやはり知見がたくさん詰まってると感じました。
