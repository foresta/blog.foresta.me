+++
title="WSL 上で Re:dash を動かす"
date="2022-09-25T18:23:02+09:00"
categories = ["engineering"]
tags = ["redash", "wsl"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、OSS の ダッシュボード作成ツールの Re:dash を WSL 上のローカルで動かすための手順などのメモです。

## 手順

以下のハンズオンの資料を参考にして構築してみます。

- {{< exlink href="https://github.com/kakakakakku/redash-hands-on" >}}


README に書いてある通りに構築を進めていきます。

### git clone

```bash
$ git clone https://github.com/kakakakakku/redash-hands-on.git
$ cd redash-hands-opn
```

### Docker

Docker を使用するので インストールしていきます。

Docker for Windows をインストールして、WSL2 用の設定を実施すればよさそうです。


{{< exlink href="https://www.docker.com/" text="Docker 公式サイト">}} から Docker Desktop for Windows の Installer をダウンロードします。


Installer起動すると、以下のようなプロンプトが表示されるので、`Use WSL 2 instead of Hyper-V (recommended)` のチェックをつけたまま進めます。

{{< figure src="/images/posts/redash-on-wsl/docker-desktop.png" >}}

インストールが完了し Windows をサインアウトして再度サインインすると wsl 上で docker コマンドが使用できるようになってます。

```bash
$ docker -v
Docker version 20.10.17, build 100c701

$ docker-compose -v
docker-compose version 1.29.2, build 5becea4c
```

### docker-compose

つづいて、以下を実行します。

```bash
$ docker-compose run --rm server create_db
$ docker-compose up -d
```

自分の環境だと以下のような Permission Error が表示されたので対応します。

```
docker.errors.DockerException: Error while fetching server API version: ('Connection aborted.', PermissionError(13, 'Permission denied'))
```

docker のグループに wsl で利用するユーザーを追加します。

```
$ sudo usermod -aG docker ユーザー名
```

上記の設定をして、念のため docker と wsl を再起動したところうまく起動しました。

### Re:dash実行

`localhost` にアクセスすると以下のように setup 画面が表示されました。


{{< figure src="/images/posts/redash-on-wsl/redash-setup.png" >}}


{{< exlink href="https://github.com/kakakakakku/redash-hands-on#readme" text="README" >}} に従って、MySQL の設定をすると、クエリを書くことができました。


{{< figure src="/images/posts/redash-on-wsl/redash-queries.png" >}}


## まとめ

今回は、wsl 上で Re:dash の構築をしました。Docker 周りで若干手こずりましたが、基本的には手順通りに docker-compsoe するだけだったので簡単に設定することができました。

Athena などにも接続できるはずなので、いろんな DataSource に接続して遊んでみようかなと思います。
