+++
title="Ubuntu のセットアップメモ"
date="2020-04-05T00:00:00+09:00"
categories = ["engineering"]
tags = ["ubuntu", "apt", "linux", "cli", "docker", "docker-compose", "hugo", "nvm"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

新しくPCを購入し、Windows とデュアルブートさせる形で、ubuntu をインストールしました。
また、ubuntu も色々とセットアップを行いましたので現状までのセットアップ内容をまとめておきます。

ちなみに、デュアルブートはこちらの記事を参考にさせていただきました。\
https://ja.unflf.com/tech/dualboot-ubuntu-windows/

また、設定ファイルは下記にありますので良かったら参考にしてみてください。 \
https://github.com/foresta/dotfiles/blob/master/README.md


この記事では触れませんが、今回は `.bashrc`, `.bash_profile` 周りも整理したりしました。

## Setup したもの

- Google Chrome
- ディレクトリ名を英語にする
- Capslock を Ctrl に変更
- パッケージを最新にする
- neovim
- pbcopy
- Docker
- Hugo
- nvm
- IME toggle 用の設定

## Google Chrome

まずは、Google Chromeをインストールします。

https://www.google.co.jp/chrome/

## ディレクトリ名を英語にする

今回は、ubuntu 18.04 LTS を日本語版でインストールしたので初期のディレクトリ名が日本語になっています。日本語はなにかとつらいにで英字に修正します。

```bash
$ LANG=C xdg-user-dirs-gtk-update
```

## Capslock を Ctrl に変更

`/etc/default/keyboard` に以下の記述をします。

```diff
+ XKBOPTIONS="ctrl:nocaps"
- XKBOPTIONS=""
```

## パッケージを最新にする

あっぷでーと。

```bash
$ sudo apt update & sudo apt upgrade -y
```

## neovim

neovim を入れます。

手順は以下のとおりです。
- python のためのビルドツールを入れる
- pyenv & python インストール 
- python の neovim インストール
- neovim 本体のインストール

### python のためのビルドツールを入れる

pythonのビルドのために必要なツール類をインストールします。

```
$ sudo apt install build-essential libbz2-dev libdb-dev \
  libreadline-dev libffi-dev libgdbm-dev liblzma-dev \
  libncursesw5-dev libsqlite3-dev libssl-dev \
  zlib1g-dev uuid-dev tk-dev
```

### pyenv & python インストール 

Github から clone してきます。

```bash
$ git clone https://github.com/pyenv/pyenv.git ~/.pyenv
```

pyenv 系の環境変数は、`.profile` に設定します

```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
```

pyenv の初期化処理は、 `.bashrc` に設定します。

```bash
# existsCmd は 指定したコマンドが存在するかどうかを確認する自作関数
if existsCmd pyenv; then
    eval "$(pyenv init -)"
fi
```

ここまでで、pyenv の設定は完了です。terminal を再起動 (もしくは、`source .bash_profile` )すれば反映されると思います。

```bash
$ pyenv -v
> pyenv 1.2.18
```


今回は、python 3.7.7 をインストールしました。

```bash
# バージョン確認
$ pyenv instlal -l

$ pyenv install 3.7.7

$ python --version
> Python 3.7.7
```

### python の neovim をインストール 

python の設定が完了したら、 pip で neovim をインストールします。

```bash
$ pip install neovim
```

### neovim 本体のインストール

neovim 本体のインストールを行います。

```bash
$ sudo add-apt-repository ppa:neovim-ppa/stable
$ sudo apt-get update
$ sudo apt-get install neovim
```

terminal で nvim と入力すると、neovim が起動します。

## pbcopy

macOS で使っていた、標準入力を clipboard に貼り付けるツールに `pbcopy` というものがあります。
今回はそれと同じようなことができる `xsel` というコマンドをインストールします。

```bash
$ sudo apt install xsel
```

インストールが完了したら、`.bashrc` に alias をはっておきます。

```bash
$ alias pbcopy="xsel --clipboard --input"
```

これで以下のように利用することが可能になります。

```bash
# file.txt の内容をコピー
$ cat file.txt | pbcopy
```

## Docker

Docker と docker-compose も何かとよく利用するのでインストールしておきます。

### 準備

Docker を追加するために必要なツール類をインストールします。

```bash
udo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```

### Docker のインストール

次に Docker公式の、GPG key を追加します。

```bash
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Docker を apt repositoyr に追加します。
```
$ sudo add-apt-repository \
     "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
     $(lsb_release -cs) \
     stable"
```


repository を更新して、Dockerをインストールします。
```bash
$ sudo apt update
$ sudo apt install -y docker-ce
```

インストールが完了したら、起動確認をします。

```bash
$ sudo systemctl status docker

$ sudo docker ps
```

このままだと、root ユーザーでしか docker を実行できないので通常ユーザーでも実行できるようにします。

```bash
$ cat /etc/group | grep docker
> docker:x:999:

# kz_morita というユーザーを docker のグループに追加
# kz_morita 部分は各々のユーザー名で置き換えてください
$ sudo gpasswd -a kz_morita docker


$ cat /etc/group | grep docker
> docker:x:999:kz_morita


$ sudo chmod 666 /var/run/docker.sock
```

これで無事 Docker を実行することができます。

```bash
$ docker ps
```

### docker-compose のインストール

docker-compose もインストールします。

```bash
# 記事執筆当時の最新バージョンをインストールします。
# release はこちらで確認 https://github.com/docker/compose/releases
$ export compose='1.25.1'

$ sudo curl -L https://github.com/docker/compose/releases/download/${compose}/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

$ sudo chmod 0755 /usr/local/bin/docker-compose

$ docker-compose -v
```

## Hugo

公式サイトを参考にして、インストールをします。
https://gohugo.io/getting-started/installing/

```bash
# Check hugo version
$ snap info hugo

# instlal hugo
$ sudo snap install hugo
```

```bash
$ hugo version
> Hugo Static Site Generator v0.68.3 linux/amd64 BuildDate: 2020-03-24T16:10:53Z
```

## nvm

下記の手順通りインストールスクリプトを用いてインストールを行います。
https://github.com/nvm-sh/nvm#install-script

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

`.bashrc` に nvm 用の設定を追加します。

```bash
# nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
```

`.profile` に環境変数を追加します。
```bash
## nvm
export NVM_DIR="$HOME/.nvm"
```

これで、terminal 再起動 or `source .bash_profile` で nvm が使用可能になります。

```bash
$ nvm version
> v12.16.1
```

ついでにnode もインストールしました。

```bash
$ nvm install 12.16.1
$ node -v
> v12.16.1

$ npm -v
> 6.13.4
```

## IME toggle 用の設定

やりたいことは、左 Ctrl 空打ちでIMEをtoggle するということです。

このために fcitx をインストールします。

```bash
$ sudo apt install fcitx fcitx-mozc
```

インストールが終わったら反映させるために、PCを再起動します。

設定アプリを開き、 地域と言語 > インストールされている言語の管理を押し、「言語サポート」を開きます。
言語サポートの、「キーボード入力に使うIMシステム」の欄で「fcitx」 を選択します。


fcitx 設定 アプリを開きます。
全体の設定 > 入力メソッドのオンオフ の欄のボタンを押し、IME toggle に利用したいボタン (今回で言えば、左 Ctrl) を押し設定完了です。

左 Ctrl 空打ちで、IME toggle できることを確認します。

## まとめ

今回は、新調したPCに入れたubuntu 18.04 LTS の設定で行ったことを簡単にまとめました。
環境構築系はさくさく進めば、自分好みにPCをカスタマイズしていく感じが楽しいですね。


環境構築系は一度しかやらないので、なかなか覚えられないことが多いので今回メモを取りながらやりました。
多分、数年先にまた新しくPCを購入したときにまた役に立ちそうな記事がかけたと思います。

同じように環境構築する方のお役に立てれば幸いです。

