+++
title="Google Colaboratory で Google Drive 上のファイルを読み込む"
date="2021-06-12T13:49:19+09:00"
categories = ["engineering"]
tags = ["colab", "colaboratory", "pandas", "csv", "analysis"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

業務でデータ分析を行う際に，Google Colaboratory で Google Drive と接続して分析を行いましたがかなり便利だったので方法についてまとめます．

## Colaboratory を新規作成

まずは Google Drive 上で，Colaboratory を作成します．

Google Drive 上で，`新規 > その他 > アプリを追加` を押して，「Colaboratory」と入力すると Google Drive 上にColaboratory を追加することができます．


{{< figure src="/images/posts/colab-mount-google-drive/colab-install.png" >}}


追加出来たら，再度 `新規 > その他` から Colaboratory を選択して新規作成します．

## Colaboratory 上で Google Drive をマウント

Colab上からGoogle Drive 上のファイルなどにアクセスするためには，Google Driveをマウントする必要があります．

以下のようなコードでマウントすることができます．

```python
from google.colab import drive
drive.mount('/content/drive')
```

上記では，`/content/drive` 配下にGoogle Drive をマウントするように設定しています．

これを実行すると以下のようなURLとテキストボックスが表示されます．

{{< figure src="/images/posts/colab-mount-google-drive/mount-drive.png" >}}


上記のURLに飛んで認証をすると，認証コードが発行されるので，そのコードをテキストボックスに入力するとマウントが完了します．


マウントが完了すると以下のように，MyDrive 配下がマウントされていることが左のメニューから確認することができます．

{{< figure src="/images/posts/colab-mount-google-drive/mount-complete.png" >}}

## ファイルを読み込んで見る

データ分析のサンプルで使われる iris の csv ファイルを Google Drive 内に配置して読み込んでみます．

データ自体はこちらのデータをお借りしました．

https://gist.github.com/netj/8836201


pandas を使い，CSV ファイルを DataFrame に読み込んでみます．

ファイルパスは 先程マウントした際に，`/content/drive` に続いて実際にcsvファイルを格納したディレクトリまでのパスを書きます．

```python
import pandas as pd

filepath = '/content/drive/MyDrive/作業用/iris.csv'

df = pd.read_csv(filepath)

df.describe()
```

下記画像のようにデータを読み込むことが出来ました．

{{< figure src="/images/posts/colab-mount-google-drive/read-csv.png" >}}

## まとめ

今回は，Google Colaboratory 上で Google Drive をマウントして使用する方法についてまとめました．
非常に簡単に使えるので，アドホックに分析がしたいときなどは非常に便利だと思います．

