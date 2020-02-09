+++
title="よく使う お掃除系 git 便利コマンド集"
date="2020-02-09T20:50:11+09:00"
categories = ["engineering"]
tags = ["git", "tips", "cli"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段 git を使って開発を行っているのですが、気がつくとローカルに既に使われていないブランチがたくさん溜まってしまったりしがちです。
今回はそれらのブランチお掃除系で普段よく使うために、snippet 化している git コマンドを紹介します。

## 3 つのコマンド

今回は、以下の 3 つのお掃除コマンドを順に紹介します。

- マージ済みブランチの削除
- リモートで消されたブランチを、ローカルのリモートブランチに反映
- 削除されたリモートブランチと同じローカルブランチを削除

## マージ済みのブランチを削除する

特定のブランチマージ済みのブランチを一括で削除します。

ここでは、`master` と `develop` ブランチマージされているローカルブランチ一括で削除しています。

```bash
$ git branch --merged | egrep -v "\*|master|develop" | xargs git branch -D

# formatted
$ git branch --merged \
  | egrep -v "\*|master|develop" \
  | xargs git branch -D
```

##### dry-run

```bash
$ git branch --merged | egrep -v "\*|master|develop"

# formatted
$ git branch --merged \
  | egrep -v "\*|master|develop"
```

### 解説

`git branch --merged` を打つと以下のようなマージ済みのブランチ一覧が取得できます。

```bash
$ git branch --merged
  develop
  feature/task1
  feature/task2
  feature/task3
* master
```

`egrep -v "\*|master|develop"` を用いて、master ブランチと develop ブランチと現在のブランチを除外したリストを手に入れます。

```bash
$ git branch --merged | egrep -v "\*|master|develop"
  feature/task1
  feature/task2
  feature/task3
```

あとは、それらを xargs に渡して 1 行ずつ ブランチ削除コマンドを実行します。

```bash
$ git branch --merged | egrep -v "\*|master|develop" | xargs git branch -D
Deleted branch feature/task1 (was 00000000).
Deleted branch feature/task2 (was aaaaaaaa).
Deleted branch feature/task3 (was 99999999).
```

## リモートリポジトリで消されたリモートブランチをローカルにも反映させる

ローカルのリモートブランチをリモートリポジトリに追従させます。

```bash
$ git remote prune origin

# もしくは
$ git fetch --prune
```

### 解説

以下のコマンドをうつと反映されます。

```bash
$ git remote prune origin
Pruning origin
URL: https://github.com/user/remote-repository.git
 * [pruned] origin/develop
 * [pruned] origin/feature/task1
 * [pruned] origin/feature/task2
 refs/remotes/origin/HEAD has become dangling!
```

また、`git fetch --prune` でも同様の効果が得られます。

また、下記の記事などで紹介されているように、git の fetch/pull コマンドで `--prune` オプションをデフォルトにしてしまうのも良いかもしれません。

https://hail2u.net/blog/software/git-config-fetch-prune.html

## 削除されたリモートブランチとおなじローカルブランチを削除

すでにリモートで削除されているローカルブランチを削除します。

```bash
$ git branch --format "%(refname:short) %(upstream:track)" | grep "\[gone\]" | awk '{print $1}' | xargs -IXXX git branch -D XXX

# formatted
$ git branch --format "%(refname:short) %(upstream:track)" \
  | grep "\[gone\]" \
  | awk '{print $1}' \
  | xargs -IXXX git branch -D XXX
```

##### dry-run

```bash
$ git branch --format "%(refname:short) %(upstream:track)" | grep "\[gone\]" | awk '{print $1}'

# formatted
$ git branch --format "%(refname:short) %(upstream:track)" \
  | grep "\[gone\]" \
  | awk '{print \$1}'
```

### 解説

まず、git branch にフォーマットを指定して、`{ブランチ名} {track状態}` というリストを取得します。リモートブランチが削除されていた場合には、track 状態が ［gone］ と表示されます。

```bash
$ git branch --format "%(refname:short) %(upstream:track)"
develop
feature/task1 [gone]
feature/task2 [gone]
feature/task3 [gone]
feature/task4
master
```

これを grep することによって、削除されたリポジトリのみをリストアップします。

```bash
$ git branch --format "%(refname:short) %(upstream:track)" | grep "\[gone\]"
feature/task1 [gone]
feature/task2 [gone]
feature/task3 [gone]
```

そして awk を用いて最初のブランチ名のみをリスト化します。

```bash
$ git branch --format "%(refname:short) %(upstream:track)" | grep "\[gone\]" | awk '{print $1}'
feature/task1
feature/task2
feature/task3
```

これらを xargs に渡して、ブランチを削除します。

```bash
$ git branch --format "%(refname:short) %(upstream:track)" | grep "\[gone\]" | awk '{print $1}' | xargs -IXXX git branch -D XXX
Deleted branch feature/task1 (was 00000000).
Deleted branch feature/task2 (was aaaaaaaa).
Deleted branch feature/task3 (was 99999999).
```

## まとめ

今回は普段使っているお掃除系の git コマンドを紹介しました。いちいちこれらのコマンドを打つのは大変なのでショートカットを作成するかスニペットに登録して使用すると便利になるかと思います。

複数人で開発しているとブランチが大量になってくるので定期的にお掃除していきましょう。（自戒を込めて）
