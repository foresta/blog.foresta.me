+++
title = "Docker上のubuntuにneovim開発環境を構築する"
thumbnail = ""
tags = ["docker", "ubuntu", "nvim"]
categories = ["engineering"]
date = "2019-04-28"
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}} です。
iOSエンジニアとしてSwiftを書いているソフトウェアエンジニアです。 それ以前は、C# でサーバーサイド書いていたり、C++/Cocos2d-xでゲーム開発をしていたりしました。

最近の自分の中の課題として低レイヤーの技術をもっと深く知るというものがあります。
そこでコンパイラを作ろうと思った矢先に下記の素晴らしいドキュメントを発見しました。

{{< exlink href="https://www.sigbus.info/compilerbook/" >}}

このドキュメントでは、Linux環境推奨であったため今回は、OSX上にDockerを用いてubuntu環境を構築してみました。

同じようにDocker上で開発環境を構築したい方のお役に立てれば幸いです。

## Docker for Macをインストール

以下のサイトからDockerをインストールします。

{{< exlink href="https://docs.docker.com/docker-for-mac/" >}}

Docker Desktop is runningになるとターミナル上から `docker` コマンドが使えるようになります。

## ローカルの開発環境をDocker上で再現する

今回は以下の作業ができることをゴールにします。

* neovimでソースコードを編集できる
* いつもOSX上で使っているneovimやその他の設定をそのまま移植する
* c言語のソースコード編集ができる
* githubにpushすることができる

## Dockerfileを書く

今回作成したDockerfileを先に記載します。\
それぞれの説明に関しては後述とさせてください。

##### Dockerfile
```dockerfile
from ubuntu:latest

label maintainer="kz.morit@gmail.com"

shell ["/bin/bash", "-c"]

run apt-get update -y && \
    apt-get install -y software-properties-common && \
    apt-add-repository -y ppa:neovim-ppa/stable && \
    apt-get update -y && \
    apt-get install -y \
    curl \
    git \
    language-pack-ja-base \
    language-pack-ja \
    neovim \
    python-dev \
    python-pip \
    python3-dev \
    python3-pip

env lang="ja_jp.utf-8" language="ja_jp:ja" lc_all="ja_jp.utf-8"

run pip3 install --upgrade neovim

env user kz_morita
env home /home/${user}

run useradd -m ${user}
run gpasswd -a ${user} sudo

copy github_id_rsa $home/.ssh/id_rsa
run chown -r ${user}:${user} $home/.ssh 

user ${user}

workdir $home 
run git clone https://github.com/foresta/dotfiles .dotfiles

workdir $home/.dotfiles
run chmod +x ./install.sh && ./install.sh

run . $home/.bash_profile

run mkdir $home/workspace

workdir $home/workspace
```

## 開発環境setup用のスクリプトを用意

今回は以下のようなshellを用意しました。

開発を始める前に、`$ ./setup.sh` と叩くことで環境を作っています。

ユーザー名は kz_morita、
Dockerfileがあるディレクトリ以下のsrcフォルダ以下をVolumeとしてマウントしています。

##### setup.h
```bash
#!/bin/bash

docker build -t workspace .
docker run -u kz_morita -it -v `pwd`/src:/home/kz_morita/workspace/c-compiler workspace /bin/bash
```


## 簡単な説明 

それでは、Dockerfileや、dockerコマンドの解説を軽くしていきます。

### neovimでソースコードを編集できる

今回はエディタとして、neovimを使用したかったのでneovimが動く環境を作成します。

基本的な、gitやcurlなどのツールと一緒に、neovimもapt-getでインストールします。
neovimはpython3環境が必要なので、それらも一緒にインストールをします。

```dockerfile
run apt-get update -y && \
    apt-get install -y software-properties-common && \
    apt-add-repository -y ppa:neovim-ppa/stable && \
    apt-get update -y && \
    apt-get install -y \
    curl \
    git \
    language-pack-ja-base \
    language-pack-ja \
    neovim \
    python-dev \
    python-pip \
    python3-dev \
    python3-pip
```

### いつもOSX上で使っているneovimやその他の設定をそのまま移植する

Dockerfile上の以下の箇所で設定をインストールしています。

自分のnvimの設定などは以下のgithubリポジトリで管理しているので、よかったら参考にしてみてください。

{{< exlink href="https://github.com/foresta/dotfiles" >}}

下記Dockerfileでは、設定をgit cloneしてきて、install用のshellを叩いています。

##### Dockerfile

```dockerfile
run git clone https://github.com/foresta/dotfiles .dotfiles

workdir $home/.dotfiles
run chmod +x ./install.sh && ./install.sh

run . $home/.bash_profile
```

### c言語のソースコード編集ができる

ubuntu環境にコンパイラなどはもともと入っているのでそこは何も設定しなくて大丈夫です。

ソースコードはgithubにpushはしますがOSX側にも保持できるように、Data Volumeとしてマウントしています。
具体的には `Dockerfileのあるディレクトリ/src` を Docker上の `/home/kz_morita/workspace/c-compoler` いかにマウントしてます。

```bash
docker run -u kz_morita -it -v `pwd`/src:/home/kz_morita/workspace/c-compiler workspace /bin/bash
```


### githubにpushすることができる

githubにDocker内からもpushしたかったので、Dockerfile内に証明書をコピーする処理を書いています。

```dockerfile
copy github_id_rsa $home/.ssh/id_rsa
run chown -r ${user}:${user} $home/.ssh 
```

ここらへんは結構無理やりになってしまったところで、Docker image内に秘密鍵を含めてしまっているのでセキュリティ的にもあんまりよろしくないだろうなぁと思っています。

どなたかうまいやり方を知っていたら教えていただきたいです。

## まとめ


今回はCコンパイラを作成するために、Docker上にLinux環境(Ubuntu) とneovim環境を構築する手順を簡単にまとめました。\
正直Dockerをしっかり理解しているわけではないため、もしかしたらいけてない書き方などしてしまっているかもしれません。

もしそういった箇所がありましたら、教えていただけると幸いです。

なにはともあれ、とりあえずCコンパイラが開発できる環境を作ることには成功したので、しっかり作っていこうと思いました。

