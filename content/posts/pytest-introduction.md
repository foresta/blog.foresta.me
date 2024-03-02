+++
title="pytest 入門 (設定, assert, fixture, conftest, LogCaptureFixture)"
date="2024-03-03T02:58:32+09:00"
categories = ["engineering"]
tags = ["pytest", "python", "test"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Pytest を初めて触ってみたのでメモです。

## 前提のプロジェクト構成

以下のような ディレクトリ構成の python プロジェクトを想定しています。

```
.
├── poetry.lock
├── pyproject.toml
├── src
│   ├── main.py
│   └── utils
│       ├── __init__.py
│       └── utils.py
└── tests
    ├── __init__.py
    ├── conftest.py
    ├── test_main.py
    └── utils
        ├── __init__.py
        └── test_utils.py
```

`src` ディレクトリと、`tests` ディレクトリに別れているような標準っぽいものです。
poetry を使って package 管理などをする前提です。

## pythonpath などの指定

tests ディレクトリから、src ディレクトリをみにいくために設定が必要でした。

設定は `pyproject.toml` もしくは `pytest.ini`、`.pytest.ini` などファイルに書くことができます。 

下記は、`pyproject.toml` に書く例です。
```toml
[tool.pytest.ini_options]
pythonpath = "src"
testpaths = ["tests"]
```

## 基本の assert

#### src/main.py

```py
def sum(x, y);
    return x + y
```

テストは以下のように書けます。

#### tests/test_main.py
```py
from main import sum

def test_hoge():
    assert sum(1, 3) == 4
```

## fixture

テストをする際に、共通の Setup 処理を書きたいケースがあります。

よくあるのが、テストに利用する class を dummy データで作るとかでしょうか。

@pytest.fixture という アノテーションを利用すると以下のように Setup 済みのデータを test に渡すことができます。

```py
import pytest

@pytest.fixture
def item():
    return Item(id = 1, name = "hoge")


# item という引数が、fixture の関数名と対応している
def test_item(item):
    assert item.some_function() == some_value
```

個人的には、テストに使用するデータを引数ありで生成したいケースなどが多いと思っているため以下のような builder を fixture で返すのが良さそうだと思っています。

```py
import pytest

class Builder:
    def item(self, item_id);
        # item_id は外から指定したい
        return Item(id=item_id, name="hoge")

@pytest.fixture
def builder():
    return Builder()


def test_item(builder):
    # item を生成するクラスを fixture に入れる
    item = builder.item(3)
    assert item.some_function() == some_value
```

## fixture の共通化

test ファイルごとに fixture を書いていくと、共通化したいモチベーションが生まれると思います。

conftest.py というファイルに fixture など共通処理を書いておくと、テスト実行時に自動で読み込まれるので共通処理を書くことができます。

たとえば、conftest.py に

```py
import pytest

class Builder:
    def item(self, item_id);
        # item_id は外から指定したい
        return Item(id=item_id, name="hoge")

@pytest.fixture
def builder():
    return Builder()
```

と書いておけば、

test_main.py や、test_hgoe.py など色々な test ファイル内で、builder というfixture が使えるようになって便利です。

## logging の test 

テストとして、エラーが出た際に正しくエラーログを吐くことを保証したいケースがあると思います。

そういった際に便利な、`LogCaptureFixture` と言うものが `pytest` には用意されています。

```py
import pytest
from _pytest.logging import LogCaptureFixture
from logging import INFO, ERROR

from some_service import SomeService 

def test_some_service(caplog: LogCaptureFixture, builder):
    caplog.set_level(INFO)

    item = builder.item(3)

    actual = SomeService.some_function(item)
    expect = /**/

    assert actual == expect

    # error ログが吐かれること
    assert caplog.record_tuples == [('root', ERROR, "Error message")]
```

上記では、SomeService というなんらかの処理を行うメソッドのテストを実施します。
普通に処理結果を assert しているのと、error ログが吐かれることのテストを書くことができます。

LogCaptureFixture というものを使用すると、logging ライブラリによりロギングされた内容を capture 可能です。

下記のようなフォーマットでキャプチャしたデータが閲覧できるので、assert ができます。
```py
# [(<logger名>, <種別>, <メッセージ>)] という tuple でキャプチャできる
assert caplog.record_tuples == [('root', ERROR, "Error message")]
```

非常に便利ですね!

## まとめ

pytest の基本的な使い方についてまとめました。

LogCaptureFixture など便利な機能も揃っていて、とても test 書きやすいと感じました。
今回は紹介してませんが、parametrize test などもかける機能があるらしく普通にテストを書く上で困ることはなさそうです。
