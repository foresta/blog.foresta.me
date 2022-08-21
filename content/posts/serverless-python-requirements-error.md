+++
title="serverless-python-requirements で No such option: --requirements エラーと回避方法"
date="2022-08-21T21:58:15+09:00"
categories = ["engineering"]
tags = ["python", "serverless"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、serverless framework で lambda を deploy している最中に、タイトルのとおり以下のエラーが発生しました。

```
Serverless: Generating requirements.txt from Pipfile...

  Error ------------------------------------------------

    Error: Usage: pipenv lock [OPTIONS]
    Try 'pipenv lock -h' for helap.

    Error: No such option: --requirements Did you mean --quiet?
```

今回はその原因と対応方法についてメモします。

## 先に結論

Pipenv のバージョンを `2022.8.5` に固定することで 上記のエラーは解消できます。

```
pip install pipenv==2022.8.5
```

serverless-python-requirements の {{< exlink href="https://github.com/serverless/serverless-python-requirements/issues/716" text="この Issue" >}} が解決されれば最新版を使えるようになります。


## 環境

環境としては、serverless framework を用いて lambda のデプロイをしていました。Pipenv を用いて各種ライブラリのバージョンなどの依存関係を管理していたため Pipfile から requirements.txt を作成する必要があり、serverless-python-requirments というライブラリを使用しています。

pipenv のバージョンは、`2022.8.15` で serverless-python-requirements は `5.1.1` を使用していました。


- {{< exlink href="https://www.serverless.com/" text="serverless.com" >}}
- {{< exlink href="https://pipenv.pypa.io/en/latest/" text="pipenv">}}
- {{< exlink href="https://www.serverless.com/plugins/serverless-python-requirements" text="serverless-python-requirements" >}}

## エラーの原因と対処方法

エラーの原因としては、serverless-python-requirements の中で、以下のようなコマンドを実行して requirements.txt を生成しています。

```
pipenv lock --requirements
```

以下の pipenv.js の L33 ~ L39 あたりの処理です。

https://github.com/serverless/serverless-python-requirements/blob/a4cd36b1145b3cb45c44eaaff0653461472e9a3c/lib/pipenv.js#L33-L39

```js
    try {
      res = await spawn(
        'pipenv',
        ['lock', '--requirements', '--keep-outdated'],
        {
          cwd: this.servicePath,
        }
      );
    } catch (e) {
        //...
    }
```

しかし、Pipenv の version `2022.8.13` から `pipenv lock --requirements` コマンドが deprecated で削除されていたためこのコマンドが実行できていませんでした.

- {{< exlink href="https://pipenv.pypa.io/en/latest/changelog/#id15" text="Release and Version History — pipenv" >}}

> The deprecated way of generating requirements install -r or lock -r has been removed in favor of the pipenv requirements command. #5200

こちらは、serverless-python-requirements のライブラリ側を修正する必要がありますがが、2022/8/21 現在ではまだ対応はなされていないようです。

Issue は Open されているようです。

- {{< exlink href="https://github.com/serverless/serverless-python-requirements/issues/716" text="Plugin not compatible with =>2022.8.13 of pipenv · Issue #716 · serverless/serverless-python-requirements · GitHub">}}


暫定的に対応するのであれば、Pipenv のバージョンを `2022.8.5` に固定する必要がありそうです。

```
pip install pipenv==2022.8.5
```


## まとめ

今回は、serverless framework とそのライブラリ、serverless-python-requirements を用いて lambda をデプロイした際に発生したエラーの回避方法について記載しました。

暫定的に対応するのであれば pipenv のバージョンを固定することで回避はできそうですので、直近で困っている方はこのように対応してみて下さい。

