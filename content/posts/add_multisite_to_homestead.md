+++
date = "2015-08-12"
title = "Homesteadに複数サイトを追加する二つの方法"

categories = ["engineering"]
tags = ["homemstead", "laravel", "php"]
+++

Homesteadに複数サイト追加するために二つの方法があったのでメモ。

前提として新しいサイトのドメインをhomestead.appとする。
公式サイトを参考にしました
http://readouble.com/laravel/5/0/0/ja/homestead.html


## Homestead.yamlに記載する方法

※既存のDBを一回壊してしまうためおすすめできません。

Homestead.yamlのsitesに追記する

```
-map homestead.app
to  /home/vagrant/Code/path/to/public/directory
```

Homesteadのディレクトリで以下のコマンドを実行

```
homestead provision
```

## serveコマンドを用いる方法

homestead ssh で仮想環境にログインする。
以下のコマンドを打つ

```
serve homestead.app /home/vagrant/Code/path/to/public/directory 80
```

## 所感

既存の環境にまで影響がでてしまうので、個人的には2番目を使っていこうかなーとおもいます。

