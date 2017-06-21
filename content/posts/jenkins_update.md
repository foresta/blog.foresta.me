+++
date = "2017-06-21T23:56:42+09:00"
title = "jenkinsさんが503 Service Unavailableと言ってるのを修正したメモ"

categories = ["engineering"]
tags = ["jenkins", "centos"]
+++

# Jenkinsさんが動かなくなってしまったので対応したメモ

借りているさくらVPSのCentOS6.7で軽い気持ちで

```
$ sudo yum update
```

したらJenkinsが動かなくなってしまった。
具体的には503が返ってきてしまう。


とりあえず、原因を調査するためにlogを見てみる。
自分の環境では以下にある。

```
$ /var/log/jenkins
```

ログの中には以下のような記述が。

```
・・・
Jenkins requires Java7 or later, but you are running 1.7.0_79-b15 from /usr/java/jdk1.7.0_79/jre
java.lang.UnsupportedClassVersionError: winstone/Launcher : Unsupported major.minor version 52.0
・・・
```

Javaのバージョンによるエラーっぽかったので公式サイトを見てみる。

すると以下のissueがたってた

https://issues.jenkins-ci.org/browse/JENKINS-43492

yum updateでJenkinsがアップデートされ、Java8が必須になったみたいなので対応していく。

Javaインストールが必要な場合は以下の記事が参考になると思う。
http://qiita.com/Sa2/items/8ba501294df745be8c78


自分の環境だと、すでにJava8はインストール済みだったのでalternativesでjavaのバージョンを変更する

```
$ sudo alternatives --config java
```

{{< figure src="/images/posts/jenkins_update/alternatives.png" title="alternatives結果" >}}

このdefaultがjava8だったのでこれを使用するように変更したのちに、Jenkinsを再起動したら無事動きました。


よかったよかった。

# 参考にしたサイト様

http://blog.officekoma.co.jp/2017/04/jenkins-http-error-503-service.html


