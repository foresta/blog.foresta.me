+++
title = "いまさら聞けない GNU make についてまとめてみた"
thumbnail = ""
tags = ["make", "linux", "gnu make"]
categories = ["engineering"]
date = "2019-06-23"
+++

こんにちは、[kz\_morita](https://twitter.com/kz_morita)です。\
普段はiOSエンジニアとしてSwiftを書いたり、Vue.js / Nuxt.js あたりでWebフロントを書いたりしているエンジニアです。

makeはソースコードをビルドしたりするのに、日頃お世話になっていますが、いまいちSyntaxなど曖昧のままなんとなく使っていたのでこれらについてまとめてみようと思います。

## 環境

```bash
$ sw_vers
ProductName:	Mac OS X
ProductVersion:	10.14.4
BuildVersion:	18E226

$ make -v 
GNU Make 3.81
...

$ gcc -v
Apple LLVM version 10.0.1 (clang-1001.0.46.4)
Target: x86_64-apple-darwin18.5.0
...

```

## makeの構成要素

makeはターミナルで `make` と入力することで起動します。
```bash
$ make
```

ビルドの構成を記述するためのファイルは通常 Makefile といった名前で保存され、専用にシンタックスに基づきビルドを行います

## 準備

シンタックスを説明する前に、以下のファイルを用意します。

```
.
├── Makefile
└── hello.c
```

hello.cの中身はなんでも良いですが、以下のようなものだと考えていただければと思います。

```c
#include <stdio.h>

int main(int argc, char **argv) {

    printf("Hello world\n");
    return 0;
}

```

## makeコマンドでビルドしてみる

それでは実際にビルドをしてみます。\

```make
hello: hello.c
    gcc hello.c -o hello
```

上記のようにMakefileに記載すると、hello.cがコンパイルされ、実行ファイルhelloが出来上がります。
makeコマンドでビルドしてみましょう。

```bash
$ make
gcc hello.c -o hello

$ ls
Makefile
hello
hello.c

$ ./hello
Hello world

```

上記のように実行ファイルが出来上がります。

## Rule

Makefileには複数の `ルール(Rule)` が記述されています。

```make
hello: hello.c
    gcc hello.c -o hello

hoge: hoge.c
    gcc hoge.c -o hoge
```

Ruleとは、上記の `hello: ` や `hoge: ` から始まる行からその下のインデントされた行までのブロックのことを指します。


各Ruleは `ターゲット (target)` 、 `必須項目 (prereq)` 、 `実行コマンド (commands)` の３つの構成要素で成り立っています。

```make
target: prereq1 prereq2
    commands
```

commands部分のインデントについては、必ず `Tab` を使用しなければいけないため注意が必要です。(スペース4つなどは、Syntax Error)

## make 実行時の動きについて

それでは make の動きについて簡単に説明していきます。

Makefileは以下のものを想定します。
```make
hello: hello.c
    gcc hello.c -o hello
```

### 初回実行時
ターミナルで `$ make` と実行されると make はまず target ファイルを探しにいきます。

初回実行時は、 `hello` というファイルは存在しないので、 make はこれをビルドしなければいけないことがわかります。

次に 必須項目を探しにいきます。先ほどの例でいうと `hello.c` を探しにいきます。\
ファイルが見つかると、commands 部分に記載したコマンドが `サブシェル` と呼ばれる別のシェル上で実行されます。 

先ほどの例だと、 `gcc hello.c -o hello` の部分ですね。
その結果として、hello というファイルが生成されます。

### 2回目以降

2回目以降も make は `hello` という target を探しにいきます。
当然初回実行時に生成済みなのでファイルは見つかります。

make は次に、 `hello` ファイル (ターゲット) と `hello.c` ファイル (必須項目) のタイムスタンプを比較します。

`hello` の方が新しい場合、すでにビルド済みなので make は何もしません。ターミナルには以下のように表示されるかと思います。

```bash
$ make
make: `hello' is up to date.
```

`hello.c` (必須項目) の方が新しい場合には、新たな変更があるため make は commands 部分の処理を実行し、 `hello` 実行ファイルを更新します。

## ターゲットを指定して、makeする

これまで紹介してきた make コマンドは引数なしで以下のように実行するものでした。

```bash
$ make
```

引数なしで make が 実行されると、Makefile の中を見て、一番上に定義されている Rule を自動で実行します。

それ以外の Ruleを実行したい場合は target を指定して make コマンドを実行することができます。

以下のようなファイルを用意します。

```
.
├── Makefile
├── hello.c
└── hoge.c
```

##### hoge.c

```c
#include <stdio.h>

int main(int argc, char **argv) {

    printf("Hoge hoge\n");
    return 0;
}
```

##### Makefile

```make
hello: hello.c
	gcc hello.c -o hello

hoge: hoge.c
	gcc hoge.c -o hoge
```


それでは、ターゲットを指定してmakeしてみます。

```bash
$ make hoge

gcc hoge.c -o hoge

$ ls
Makefile
hello.c
hoge
hoge.c

$ ./hoge
Hoge hoge
```

ターゲットを指定しないと、

```bash
$ make
gcc hello.c -o hello
```

このように、自動的に一番上のRuleが実行されます。


ちなみに、存在しないターゲットを指定すると以下のようなエラーが表示されます。

```bash
$ make fuga
make: *** No rule to make target `fuga'.  Stop.
```

## 依存関係について

それでは、hello.c からその他のソースコードを呼び出して実行するようなアプリを書いてみます。

### 準備

今回は、簡単な足し算の `int sum(int x, int y)` が定義された `sum.c` を用意して、 `hello.c` から呼び出してみます。

```
.
├── Makefile
├── hello.c
└── sum.c
```

##### hello.c

```c
#include <stdio.h>

extern int sum(int, int);

int main(int argc, char **argv) {

    printf("Hello world\n");

    // sumを呼び出す
    printf("5 + 3 = %d\n", sum(5,3));
    return 0;
}

```

##### sum.c

```c
int sum(int x, int y) {
    return x + y;
}
```

##### Makefile
```make
hello: hello.o sum.o
	gcc hello.o sum.o -o hello

hello.o: hello.c
	gcc -c hello.c

sum.o: sum.c
	gcc -c sum.c

```

### 実行してみる

```bash
$ make
gcc -c hello.c
gcc -c sum.c
gcc hello.o sum.o -o hello

$ ./hello
Hello world
5 + 3 = 8

```

意図通りうまく動いてそうです。


### Makefileの動き

使用した `Makefile` を再掲します。

```make
hello: hello.o sum.o
	gcc hello.o sum.o -o hello

hello.o: hello.c
	gcc -c hello.c

sum.o: sum.c
	gcc -c sum.c
```

make の流れを簡単に説明すると、以下のような感じです。

* Makefileの先頭にあるhelloターゲットが対象
* hello ターゲットファイルが見つからないのでビルドする
* hello は `hello.o` と `sum.o` が必要だとわかる
* `hello.o` を Makefileから探し、 `hello.o` targetのRuleを見つける
* 必須項目の `hello.c` が見つかったので、gcc コマンドでビルド
* `sum.o` を Makefileから探し、`sum.o` targetのRuleを見つける
* 必須項目の `sum.c` が見つかったので、gcc コマンドでビルド
* ビルドされた `*.o` ファイルを用いて、hello 実行ファイルをビルドして作成

## ワイルドカードも使える

上記のMakefileは少し冗長な部分があります。\
Makefileではワイルドカードも使えるので以下のように書き直すことが可能です。

```make
hello: *.o
	gcc $^ -o $@

*.o: *.c
	gcc -c $^

```

上記の `*.o` `*.c` のように、ワイルドカードを指定することができます。

ここまでで、説明してこなかった２つの記号が上記Makefileには出現しています。

`$^`, `$@` 共に Makefileの組み込みの変数です。
`$^` は全ての必須項目をスペースで区切ったリストを表しています。\

そのためこのケースでは、 `gcc -c $^` は `gcc -c hello.c sum.c` と等価であり、\
`gcc ＄^ -o $@` は `gcc hello.o sum.o -o hello` と等価となります。

それでは、実際に `make` を実行してみてみます。

```bash
$ make
gcc -c hello.c sum.c
gcc *.o -o hello

$ ./hello
Hello world
5 + 3 = 8
```

しっかり挙動は変わらず、短くスッキリ書くことができました。

説明はしていなかったのですが、Makefile内では、`$ + 1文字` もしくは、 `$(文字)`, `${文字}` は変数として認識されます。

## make clean について

makeを使用する際に、よく定義されるものにcleanというものがあります。\
これは、ビルド時の生成物や、中間ファイルなどを削除する際に `$ make clean` としてよく用いられるコマンドです。

例えば、直前の例で説明した make コマンドを叩くと以下のようなファイルができます。

```
.
├── Makefile
├── hello
├── hello.c
├── hello.o
├── sum.c
└── sum.o
```

ここでいう、 `hello` `hello.o` `sum.o` はビルドでできた成果物です。\
今回はこれらを削除する `clean` コマンドを作成してみます。

##### Makefile

```make
hello: *.o
	gcc $^ -o $@

*.o: *.c
	gcc -c $^

clean:
	rm -f *.o hello
```

それでは、 `make clean` してみます。

```bash
$ ls
Makefile
hello
hello.c
hello.o
sum.c
sum.o

$ make clean
rm -f *.o hello

$ ls
Makefile
hello.c
sum.c
```

意図通り動いてそうです。\
しかし上記の指定は問題があります。

仮に、 `clean` というファイルが存在する場合について考えてみます。

```bash
$ touch clean
$ ls
Makefile
clean       # <- このファイル
hello
hello.c
hello.o
sum.c
sum.o

$ make clean
make: `clean' is up to date.
```

上記のように、 `clean is up to date. ` と常に表示されてしまいます。

これは、 `clean` という target に対して、必須項目がないため、cleanは常に最新と make に見なされてしまい、rm コマンドが実行されることはありません。

### 擬似ターゲットと .PHONY

この問題を解決するために、 GNU make には、 `.PHONY` という特殊なターゲットが用意されています。

実際のファイルとい関係ない (今回でいう clean) ターゲットを `.PHONY` の必須項目に指定することで、それが `擬似ターゲット` であると指定することができます。

擬似ターゲットである target については、 make がファイルとは関係ない target だと認識できるため、今回の例でいう clean コマンドを ファイルに関係なく実行することが可能となります。

```make
hello: *.o
	gcc $^ -o $@

*.o: *.c
	gcc -c $^

.PHONY: clean
clean:
	rm -f *.o hello
```

```bash
$ make clean
rm -f *.o hello

```


## まとめ

今回は、 `GNU make` について簡単にまとめてみました。\
普段何気なく使っている make も色々な構文や、できることがたくさんありそうで、非常に勉強になりました。

普段使ってるツールについて調べてみるのも学びが多くて良いなぁと感じました。
