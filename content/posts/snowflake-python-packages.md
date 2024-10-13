+++
title="Snowflake 上で使用できる Python ライブラリについて"
date="2024-10-13T22:49:50+09:00"
categories = ["Engineering"]
tags = ["snowflake", "python"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Snowflake 上で Python コードを書くことができるのですが、その際にPython のライブラリ何が使えるのかを調べたのでまとめます。

## Snowflake で Python の Package を利用する

Snowflake では、あらゆるところで Python のコードを書くことができます。

たとえば、Function (User Defined Function) や Procedure などで使うことができます。

- {{< exlink href="https://docs.snowflake.com/ja/developer-guide/udf/python/udf-python-introduction" text="Python UDFsの紹介" >}}
- {{< exlink href="https://docs.snowflake.com/ja/developer-guide/stored-procedure/stored-procedures-python" text="Python でのストアドプロシージャ" >}}


Python といえば、numpy などのライブラリですが、これらは基本的に Snowflake 上で使用することができます。

実際にどの Package が使えるかは、anaconda の package のリポジトリサイトから閲覧することができます。

- {{< exlink href="https://repo.anaconda.com/pkgs/snowflake/" >}}

見てみると、

- numpy
- pandas
- boto3 

など基本的な Package は使用できるみたいです。

また、自作の Package なども Snowflake の Stage にアップロードすることで使えるようになります。

- {{< exlink href="https://docs.snowflake.com/ja/developer-guide/udf/python/udf-python-creating#label-udf-python-stage" >}}


ちなみに、Python 以外にも、Java, JavaScript, Python, Scala などを使用することができるため、既存の資産を使いつつ Snowflake 側でデータ処理を行うことができそうです。

## まとめ

今回は、Snowflake 上で使用できる Python のライブラリと対応している Package 一覧について記載しました。
実際に実務でも、Snowflake 上で Python のコードを動かすことはやっています。

Function などを Python で記載することで、SQL と Python で処理を別々に書き一緒に呼び出すみたいなこともできるのでとても便利です。


