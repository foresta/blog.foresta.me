+++
title="Ubuntu で apt update エラーの対照法"
date="2024-04-07T21:37:37+09:00"
categories = ["engineering"]
tags = ["ubuntu", "linux"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Ubuntu で `apt update` などを実行したときにエラーがでて、調べながら対応したのでまとめます。

## NO_PUBLEY エラー

以下のようなエラーです。

```
アップグレードできるパッケージが 1 個あります。表示するには 'apt list --upgradable' を実行してください。
W: 署名照合中にエラーが発生しました。リポジトリは更新されず、過去のインデックスファイルが使われます。GPG エラー: http://repo.mysql.com/apt/ubuntu bionic InRelease: 公開鍵を利用できないため、以下の署名は検証できませんでした: NO_PUBKEY HOGEHOGEHOGEHOGE
```

(HOGEHOGE 書いてるところは仮の文字列で、状況によって異なります)

このエラーは PUBLIC KEY が見つからないので再度ダウンロードしてくる必要があります。


以下のような、コマンドで追加できます。
```bash
$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys HOGEHOGEHOGEHOGE
```

例えば、Google Cloud のような ubuntu の keyserver 以外から取得する際は以下のようなコマンドになります。
```bash
$ curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
```

## 署名照合中にエラー

以下のようなエラーです。

```
W: 署名照合中にエラーが発生しました。リポジトリは更新されず、過去のインデックスファイルが使われます。GPG エラー: https://dl.yarnpkg.com/debian stable InRelease: 以下の署名が無効です: EXPKEYSIG 23E7166788B63E1E Yarn Packaging <yarn@dan.cx>
```
こちらは、証明書の有効期限などが切れている場合に出ます。

以下コマンドで有効期限が切れている証明書を見ることができます。
```bash
$ sudo apt-key list
```

こちらも対応方法は NO_PUBKEY の場合と同じで証明書を追加します。

例えば以下のような感じです。

```bash
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
```

## ~~~で複数回設定されています エラー

apt update に以下のようなエラーが大量に出ました。

```
W: ターゲット Packages (main/binary-amd64/Packages) は /etc/apt/sources.list.d/google-chrome.list:3 と /etc/apt/sources.list.d/google.list:1 で複数回設定されています
W: ターゲット Packages (main/binary-all/Packages) は /etc/apt/sources.list.d/google-chrome.list:3 と /etc/apt/sources.list.d/google.list:1 で複数回設定されています
W: ターゲット Translations (main/i18n/Translation-ja_JP) は /etc/apt/sources.list.d/google-chrome.list:3 と /etc/apt/sources.list.d/google.list:1 で複数回設定されています
```

自分の場合は、chrome でこれが大量に出ており、`google-chrome.list` と `google.list` で同じパッケージをダウンロードするような設定になっていたためでした。

chrome をダウンロードする際に以下のように手動で、`google.list` を追加していたのが後で自動で追加された `google-chrome.list` と競合していたみたいです。

```
$ sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
```

そのため、google.list を削除してもう一度 apt update で正常に動きました。

## まとめ

今回は ubuntu の update 時に出たエラーについてまとめました。

アップデートが貯まるといろいろと証明書切れたり、手間が増えそうなのでこまめに作業しようと反省しました。

