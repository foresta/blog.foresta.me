+++
title="Python の oscrypto で LibraryNotFoundError の発生とその対処"
date="2023-10-15T19:03:15+09:00"
categories = ["engineering"]
tags = ["python", "pip"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Python 周りの環境を構築したりしているなかで、{{< exlink href="https://github.com/wbond/oscrypto" text="oscrypto" >}} で以下のようなエラーが発生しました。

```
oscrypto.errors.LibraryNotFoundError: Error detecting the version of libcrypto
```


上記エラーのの原因調査と回避方法についてまとめます。

## 原因

原因は以下の Issue にかかれています。

- {{< exlink href="https://github.com/wbond/oscrypto/issues/75" >}}
- {{< exlink href="https://github.com/wbond/oscrypto/issues/78" >}}

oscrypto ライブラリから、OpenSSL の 3.0.10 以降のバージョンを認識できないことが原因です。


実装自体は以下の Pull Request で解消されています。

- {{< exlink href="https://github.com/wbond/oscrypto/pull/76/files" >}}

↓コードが openssl のライブラリを正規表現で判定するところですが、1桁しか判定できないようになっていたっぽいです。
```python
version_match = re.search('\\b(\\d\\.\\d\\.\\d[a-z]*)\\b', version_string)
```

master ブランチにはすでにマージされていますが、まだ `PyPI` にはリリースされていないので、pip install で最新版はインストールできません。

## 回避方法

回避方法としては、github の master ブランチの commit hash を指定して pip install すれば大丈夫です。

requiments.txt を使っている場合は以下のようにして特定の hash の commit を指定できます。

```
oscrypto @ git+https://github.com/wbond/oscrypto.git@1547f53
```

上記は {{< exlink href="https://github.com/wbond/oscrypto/commit/1547f535001ba568b239b8797465536759c742a3" text="1547f53" >}} の hash を指定している例になります。

上記を `requirements.txt` に追加して下記で pip install したところ、上記エラーを回避することができました。

```bash
$ pip install -r requirements.txt
```

## まとめ

今回は Python の oscrypto のエラーの原因と回避方法についてまとめました。

Python は久しぶりだったのですが、Issue 探すと色々とやりとりされているのでライブラリの 1 次情報 である GitHub を見に行くのは大事だなと改めて思いました。
