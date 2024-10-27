+++
title="Python の pip で依存関係も含めて update する"
date="2024-10-27T22:21:12+09:00"
categories = ["engineering"]
tags = ["python", "pip", "tips"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Python のパッケージ管理ツールである pip で、依存関係を解決してパッケージをインストールする方法についてメモします。

## `--upgrade-storategy` オプション

依存関係もまとめてアップデートするには、`--upgrade-storategy` オプションを使います。

```bash
$ pip install --upgrade --upgrade-strategy eager <パッケージ名>
```

ちなみに、`--upgrade-strategy` オプションには以下の値が指定できます。

- `only-if-needed`: 依存関係のアップデートは行わない
- `eager`: 依存関係も含めてアップデートする

デフォルトは、`only-if-needed` です。

## まとめ

今回は pip の `--upgrade-strategy` オプションを使って、依存関係も含めてパッケージをアップデートする方法について紹介しました。

あまり使う機会なさそうですが、依存関係を含めてアップデートしたい場合に覚えておくと良さそうです。

