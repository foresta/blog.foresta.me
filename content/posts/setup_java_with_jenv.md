+++
title="Java を jenv を使って環境構築する"
date="2021-09-11T23:57:37+09:00"
categories = ["engineering"]
tags = ["java", "jenv"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は 新しいPC に Scala の環境を整えるためにまずは Java をセットアップしたので手順などをメモしておきます。

## PC環境

今回の環境は M1 チップを搭載した Mac Mini 上で構築しています。

差分がある場合は適宜読み替えてください。

```bash
$ sw_vers
ProductName:	macOS
ProductVersion:	11.4
BuildVersion:	20F71
```


## Java のダウンロード

Scala は JVM 上で動くため、まずは Java をインストールします。

自分の環境では、Java のバージョンを切り替えたかったため jenv をインストールしています。

- https://github.com/jenv/jenv

今回は Homebrew でインストールします。

```bash
$ brew install jenv
```

Install ができたら、以下を .bashrc などに追記して `source ~/.bashrc` などで反映します。

##### .bashrc
```bash
# パスを通す
export JENV_ROOT="$HOME/.jenv"
export PATH="$JENV_ROOT/bin:$PATH"

# jenv init
# existsCmd はコマンドが存在するかどうかをチェックする自作関数
if existsCmd /usr/libexec/java_home; then
    if existsCmd jenv; then
        eval "$(jenv init -)"
    fi
fi
```

```bash
$ source ~/.bashrc

$ jenv --version
jenv 0.5.4
```

Java 本体は homebrew でインストールしてみます。

```bash
$ brew install java

$ which java
/opt/homebrew/Cellar/openjdk/16.0.2/libexec/openjdk.jdk/Contents/Home
```

jenv に追加します。

```bash
$ jenv add /opt/homebrew/Cellar/openjdk/16.0.2/libexec/openjdk.jdk/Contents/Home

$ jenv versions
* system (set by /Users/kz_morita/.jenv/version)
  17

$ jenv global 17

$jenv versions
  system
* 17 (set by /Users/kz_morita/.jenv/version)
```

上記のように Java 17 のインストールが完了しました。

```bash
$ java --version
openjdk 17 2021-09-14
OpenJDK Runtime Environment Homebrew (build 17+0)
OpenJDK 64-Bit Server VM Homebrew (build 17+0, mixed mode)

$ javac --version
javac 17
```

## まとめ

今回は jenv を用いて Java をインストールしました。M1 Mac ということで何かつまづくかなと思いきや何ごともなくスムーズにセットアップできました。引き続き Scala の環境も作っていきます。

