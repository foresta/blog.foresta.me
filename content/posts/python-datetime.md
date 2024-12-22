+++
title="Python の日付処理周りのメモ"
date="2024-12-22T23:11:02+09:00"
categories = ["engineering"]
tags = ["python"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

久しぶりに Python を触って日付周りの処理を調べたのでまとめます。

## datetime

datetime モジュールについて見ていきます。

```python
import datetime
```

### 現在時刻の取得

```python
>>> print(datetime.date.today())
2024-12-22
>>> print(datetime.datetime.today())
2024-12-22 23:31:49.193061
```

### 初期化

```python
>>> print(datetime.date(2024,12,1))
2024-12-01
>>> print(datetime.datetime(2024,12,1,12,0,0))
2024-12-01 12:00:00
```

### 日付の加算

timedelta を使用すると加算などが行えます

```python
>>> today = datetime.date.today()
>>> today
datetime.date(2024, 12, 22)
>>> today + datetime.timedelta(days=1)
datetime.date(2024, 12, 23)
>>> today - datetime.timedelta(weeks=1)
datetime.date(2024, 12, 15)
```

### 文字列 <-> 日付

文字列 -> 日付

```python
>>> print(datetime.datetime.strptime("2024/12/22", "%Y/%m/%d"))
2024-12-22 00:00:00
```

日付 -> 文字列

```python
>>> today
datetime.date(2024, 12, 22)
>>> print(today.strftime("%Y/%m/%d"))
2024/12/22
>>>
```

## まとめ

Python の日付周りのメモを書きました。調べればすぐ出てきますがこのあたりであればちゃんと覚えたいなと思ったので記載しました。

