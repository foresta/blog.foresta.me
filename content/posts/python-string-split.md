+++
title="Python の split 関数の空文字の時の挙動について"
date="2022-10-09T23:00:24+09:00"
categories = ["engineering"]
tags = ["python", "tips"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

python で文字列を指定した区切り文字で分割できる split 関数がありますが、空文字の時の挙動に気づかずバグを生んでしまっていたのでメモです。

## 空文字の時の挙動

split 関数は以下のような使い方をします。

```python
>>> "a,b,c".split(",")
['a', 'b', 'c']
```

環境変数からカンマ区切りの値を取得してそれを配列に展開する以下のようなコードを書いてました。

```python
server_names = os.getenv("SERVER_NAMES").split(",")

for server_name in server_names:
    # サーバーごとの処理
```

環境変数に何も渡さない (空文字を渡した) ときに、for 文の中身が実行されないことを期待していたのですが実際には期待せずに実行されてしまいエラーになってました。

これは空文字を split すると空文字が要素の配列を返すことによるものでした。
```python
>>> "".split(",")
['']
```

空文字の配列を許したくなければ、リストを空文字以外でフィルタリングしてあげればよさそうです。

```python
server_names = [i for i in os.getenv("SERVER_NAMES").split(",") if not i == '']
```

上記はリスト内法表記を使ったフィルタリングですが、これで意図しない空文字が配列として登録されるのを防ぐことができます。

## まとめ

今回は python の split 関数の空文字の時の挙動について書きました。
ちゃんと使用する関数の挙動を把握しておかないと思わぬところで不具合でがちです。特に普段あまり触らない言語などでは、ちゃんと仕様確認をすべきだなと反省したので戒めとしての記事を残しておきます。
