+++
title="Streamlit で multiprocessing を使う際の注意点"
date="2024-01-07T21:34:42+09:00"
categories = ["engineering"]
tags = ["streamlit", "python", "multiprocessing"]
thumbnail = ""
+++

あけましておめでとうございます。{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

年末年始休暇に入り面白そうだと思っていた Streamlit で遊んでいました。
その中でコストの高い計算をする際に並列処理を行おうと思い、{{< exlink href="https://docs.python.org/ja/3/library/multiprocessing.html" text="multiprocessing">}} で実装を行っていたのですが色々とはまりどころがあったため、まとめます。

## やりたいこと 

やりたいことは以下のようなコードになります。

(以下は動かないコードです)
```python
import streamlit as st
import time
from multiprocessing import Pool 

# 2倍を計算
def double(x):
    print(f"x = {x}")
    time.sleep(0.01)
    return x * 2

# multiprocess で動かすための関数
def calcurate(count):
    with Pool() as p:
        result = p.map(double, range(count))

    return result

st.write("Hello world")
COUNT = 10000
with st.spinner("Calcurating..."):
    result = calcurate(COUNT)

st.write(result)
```

streamlit 上で 10000 回計算を並列で回して結果を取得しています。
ローディングを出したい為、spinner なども表示していますが基本的にはシンプルなコードです。

上記のコードはエラーがでて動かないのですがこちらをベースにしてハマった点を書きます。

## \_\_main\_\_ 内で実行しないと動かない

上記を実行すると以下のようなエラーが発生します。

```
RuntimeError:
        An attempt has been made to start a new process before the
        current process has finished its bootstrapping phase.

        This probably means that you are not using fork to start your
        child processes and you have forgotten to use the proper idiom
        in the main module:

            if __name__ == '__main__':
                freeze_support()
                ...

        The "freeze_support()" line can be omitted if the program
        is not going to be frozen to produce an executable.
```

これは `__main__` 内で実行することで解消できます。

```python
import streamlit as st
import time
from multiprocessing import Pool

def double(x):
    print(f"x = {x}")
    time.sleep(0.01)
    return x * 2

def calcurate(count):
    with Pool() as p:
        result = p.map(double, range(count))

    return result

def main():
    # main 関数の中へ
    st.write("Hello world")
    COUNT = 10000
    with st.spinner("Calcurating..."):
        result = calcurate(COUNT)

    st.write(result)

if __name__ == '__main__':
    main()
```

これで実際に動かすことができます。

{{< figure src="/images/posts/multiprocessing-on-streamlit/result1.png" >}}

## 結果を dataclass で返したい

ので、以下のようにコードを変更しました。

(以下エラーが出るコードです。)
```python
import streamlit as st
import time
from multiprocessing import Pool
from dataclasses import dataclass

@dataclass(frozen=True)
class Result:
    original: int
    calcurated: int

def double_return_dataclass(x):
    print(f"x = {x}")
    time.sleep(0.01)
    return Result(x, 2 * x)

def calcurate(count):
    with Pool() as p:
        result = p.map(double_return_dataclass, range(count))

    return result

def main():
    st.write("Hello world")
    COUNT = 10000
    with st.spinner("Calcurating..."):
        result = calcurate(COUNT)

    st.write(result)

if __name__ == '__main__':
    main()
```

Result という dataclass を定義して `double_return_dataclass` というメソッドに変更しています。

実行してみると以下のようなエラーがでます。

```
Exception in thread Thread-27 (_handle_results):
Traceback (most recent call last):
  File "/Users/{username}/.pyenv/versions/3.10.13/lib/python3.10/threading.py", line 1016, in _bootstrap_inner
    self.run()
  File "/Users/{username}/.pyenv/versions/3.10.13/lib/python3.10/threading.py", line 953, in run
    self._target(*self._args, **self._kwargs)
  File "/Users/{username}/.pyenv/versions/3.10.13/lib/python3.10/multiprocessing/pool.py", line 579, in _handle_results
    task = get()
  File "/Users/{username}/.pyenv/versions/3.10.13/lib/python3.10/multiprocessing/connection.py", line 251, in recv
    return _ForkingPickler.loads(buf.getbuffer())
AttributeError: Can't get attribute 'Result' on <module '__main__' from '/Users/{username}/Library/Caches/pypoetry/virtualenvs/data-usage-monitor-xA2XThov-py3.10/bin/streamlit'>
```

エラーをみる限りだと、Result dataclass にアクセスできなくてエラーになっていそうです。

このエラーの治し方としては、2 通り確認できました。

### dataclass を別ファイルとして切り出す

spawn した別プロセスから、Result にアクセスできていないのが問題っぽいのですが、app.py は `__main__` で実行されないのか別ファイルとして dataclass を切り出すをうまく動きました。

メインの処理が、`app.py` で新たに `result.py` を作成して import するようにしています。

#### app.py
```python
import streamlit as st
import time
from multiprocessing import Pool

from result import Result

def double_return_dataclass(x):
    print(f"x = {x}")
    time.sleep(0.01)
    return Result(x, 2 * x)

def calcurate(count):
    with Pool() as p:
        result = p.map(double_return_dataclass, range(count))
        p.close()
        p.join()

    return result

def main():
    st.write("Hello world")
    COUNT = 10000
    with st.spinner("Calcurating..."):
        result = calcurate(COUNT)

    st.write(result)

if __name__ == '__main__':
    main()
```
#### result.py

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Result:
    original: int
    calcurated: int
```
---
ちなみに、streamlit でマルチページの実装をしていると、`pages/` ディレクトリ以下に python ファイルをおくことになるかと思いますが、親階層の python ファイルを読み込むにも多少 Tips がありました。

例えば以下のような階層構造を想定しています。
```
- pages/
  -- page.py
- data/
  -- result.py
- app.py
```

page.py から result.py を読むためには以下のように `sys.path` に page.py の親階層を追加する必要があります。

#### page.py

```python
sys.path.append(str(Path(__file__).resolve().parent.parent))
from data.result import Result
```

### multiprocessing を fork で動かす

他の方法としては、fork で動かすことでも動作確認できました。
`set_start_method` で fork を指定することができます。

```python
import streamlit as st
import time
from multiprocessing import Pool, set_start_method

from dataclasses import dataclass

@dataclass(frozen=True)
class Result:
    original: int
    calcurated: int

def double_return_dataclass(x):
    print(f"x = {x}")
    time.sleep(0.01)
    return Result(x, 2 * x)

def calcurate(count):
    set_start_method("fork", force=True) # fork にかえる
    with Pool() as p:
        result = p.map(double_return_dataclass, range(count))
        p.close()
        p.join()

    return result

def main():
    st.write("Hello world")
    COUNT = 10000
    with st.spinner("Calcurating..."):
        result = calcurate(COUNT)

    st.write(result)

if __name__ == '__main__':
    main()
```

spawn でできなかったのは、子プロセスに dataclass の情報を渡せなかったからで、fork にして親プロセスをコピーすることで dataclass へ参照できたということだと理解してます。

## まとめ

今回は、streamlit 上で multiprocessing モジュールを使用した時につまづいた点についてまとめました。
streamlit 上というより、multiprocessing モジュール、もっと言えば 並列処理に対しての知識が足りなくつまづいたりしました。
が、重たい処理をする上では避けては通れないので今回良い勉強になりました。

また、streamlit 非常に簡単に UI を作れてとても便利なのでどんどん活用していきたいです。
