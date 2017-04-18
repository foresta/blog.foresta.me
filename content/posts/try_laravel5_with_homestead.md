+++
date = "2015-07-15"
title = "Homesteadを使ってLaravel5を動かしてみる"

categories = ["engineering"]
tags = ["laravel", "homestead", "php"]
thumbnail="/posts/thumbnails/laravel-logo.jpg"
+++

PHPerなので、Laravel5を実際にさわってみることにする。


# Laravelとは

最近巷ではやっているphpのフレームワークで、近年のモダンな書き方をとりいれていて
今風にphpが書ける。

[Laravel 公式サイト](http://laravel.jp/)

# 手順

## 各種インストール

* [Vagrant](https://www.vagrantup.com/)

公式サイトからdmgファイルをダウンロードしてきてインストールする。

* [Virtual Box](https://www.virtualbox.org/)

公式サイトからdmgファイルをダウンロードしてインストールする。

* [composer](https://getcomposer.org/)

```
curl -sS https://getcomposer.org/installer | php
mv ./composer.phar /usr/local/bin/composer
```

あとPATHも通す、もしくはPATHの通っているディレクトリに移動する。

## Boxの作成・Homestead準備

```
vagrant box add laravel/homestead
git clone https://github.com/laravel/homestead.git Homestead
```

cloneしたHomesteadディレクトリに移動し、init.shを実行する。

```
cd ./Homestead
bash init.sh
```

これで、~/.homestead 配下に必要なファイルたちがどこどこ作られる。

vagrantで仮想マシンを立ち上げたとき用の鍵ペアを作成する。
(すでにある場合はつくらなくても大丈夫?)

```
ssh-keygen -t rsa -C "you@homestead"
```

## 設定ファイル記述

設定ファイルの場所
```
~/.homestead/Homestead.yaml
```

以下の様に修正する
(修正がいらない箇所は省略します)

※作業用ディレクトリを~/workとし、その配下に後述のlaravelプロジェクトの作成の際にlaravelディレクトリを作成する。

```
providor: virtualbox

authorize: ~/.ssh/id_rsa.pub

key:
- ~/.ssh/id_rsa

folders:
- map: ~/work/laravel
to: /home/vagrant/Code/laravel

sites:
- map: homestead.app
to: /home/vagrant/Code/laravel/public
```

* providorにはvirtualboxを指定
* authorizeとkeyには以前の手順で作成したキーペアへのパスを指定
* foldersはローカルと、vagrant上で同期をとるためのマッピング
* sitesはurlと公開フォルダのマッピング

この場合 http://homestead.app にアクセスすると/home/vagrant/Code/laravel/public配下がドキュメントルートとなる。

## Hostsの設定

/etc/hostsに以下の記述を追加する。

```
192.168.10.10 homestead.app
```

192…の部分はHomestead.yamlに記載されているipを、
その後はsitesのmapの方のurlを記述する。

## Laravel Projectの作成

作業用ディレクトリに移動して以下のコマンドを打つ

```
composer create-project laravel/laravel laravel --prefer-dist
```

そうするといろいろダウンロードが始まって、laravelフレームワークが使えるようになる。

以下のコマンドでvagrant立ち上げる

```
homestead up
```


ブラウザでhttp://homestead.appにアクセスして以下のページになればOK

{{< figure src="/images/posts/try_laravel5_with_homestead/success.png" >}}

手順は以上です。

# うまく行かない場合

## nginx php no input file specifiedと表示される

nginxがphpファイルを見つけられていないので、hostsや、Homestead.yamlを要確認

## vendor/autoload.phpが無いよって怒られる。

以下の様な画面が表示され、vendor/autoload.phpが無いよって言われる

{{< figure src="/images/posts/try_laravel5_with_homestead/error_autoload.png" >}}

vagrantにsshでログインしてcomposer installで色々インストールする。
```
homestead ssh
cd /home/vagrant/Code/laravel/
composer install
```

## no supported encrypted foundと怒られる

以下の様な画面が表示された場合。

{{< figure src="/images/posts/try_laravel5_with_homestead/error_encrypt.png" >}}

プロジェクトのディレクトリに移動してkey:generateする

```
homestead ssh
cd /home/vagrant/Code/laravel/
php artisan key:generate
```

# 参考させていただいたサイト様

* [Laravel5がリリースされたので解説サイト作った](http://site.oganity.pw/%E6%8A%80%E8%A1%93%E3%83%8D%E3%82%BF/laravel5%E3%81%8C%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9%E3%81%95%E3%82%8C%E3%81%9F%E3%81%AE%E3%81%A7%E8%A7%A3%E8%AA%AC%E3%82%B5%E3%82%A4%E3%83%88%E4%BD%9C%E3%81%A3%E3%81%9F/)
* [そろそろ暖かくなってきたし CentOS6 に Laravel5 をインストールしてみた](http://qiita.com/IKEA_dless/items/8f02b3ea35c83c265307)
* [CentOSにPHP5.5をインストール](http://qiita.com/pakiln/items/bcddcdd96e94dab96873)
* [Laravel Homesteadを使ってみよう！](http://qiita.com/syossan27/items/0104615e5f9ae26f0720)
* [Laravelで…vendor/autoload.php): failed to open stream: No such file or directory というエラーによりデフォルト画面が表示されない解決方法](http://qiita.com/pugiemonn/items/3d000ac0486987dd92df)
* [No supported encrypter found. The cipher and / or key length are invalid. (laravel 5.1)](http://jsapachehtml.hatenablog.com/entry/2015/07/05/061516))
