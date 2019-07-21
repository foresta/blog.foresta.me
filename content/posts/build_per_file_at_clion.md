+++
categories = ["engineering"]
date = "2019-07-21"
title = "競技プログラミングのためのCLion環境を構築した"
thumbnail = ""
tags = ["clion", "c++", "atcoder"]
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。\
最近また競技プログラミングをやり始めました。C++で挑戦していて [CLion](https://www.jetbrains.com/clion/) を使用しているのですが、競技プログラミングとなると問題ごとにファイルをわけ、そのファイル単位で実行する必要があります。

例えば、[AtCoder](https://atcoder.jp/) のビギナーコンテスト (通称 ABC) では、問題が6問出題されるため以下のようなファイルを作ることが多いです。

```
.
├── a.cpp
├── b.cpp
├── c.cpp
├── d.cpp
├── e.cpp
└── f.cpp
```

競技中には各ファイルごとにビルドできるようにする必要があるためその設定をCLion で行いました。

今回は、その設定やCLion上でのフォルダ構成などを簡単にご紹介します。

## ディレクトリ構成

ディレクトリ構成は以下のようにしています。

```
atcoder
├── abc
│   ├── 130
│   │   ├── a.cpp
│   │   ├── b.cpp
│   │   ├── c.cpp
│   │   ├── d.cpp
│   │   ├── e.cpp
│   │   └── f.cpp
│   ├── 131
│   │   └── ...
│   └── CMakeLists.txt
├── agc
├── arc
└── begin_contest.sh
```

atcoderディレクトリの下に、各コンテスト名ごとにディレクトリを切っています。\
(abc = AtCoder Beginner Contest, arc = AtCoder Regular Contest, agc = AtCoder Grand Contest)

そのコンテスト名の下に、各コンテストの番号のディレクトリを切り、その下に各問題のcppファイルを配置しています。

実際にコンテストに参加する際は、各コンテスト名のディレクトリごとにCLionを開くようにしています。 (ABC に出場するときは、abcディレクトリをCLionで開く)
また、abc ディレクトリ直下にあるCMakeLists.txtでプロジェクトのビルドの設定を行なっています。

## CMakeLists.txt に実行できるファイルを設定する

CLion上で、各ファイルをビルド&実行できるようにするためにはCMakeLists.txtに設定を追加する必要があります。

`add_executable()` を設定するとそのファイル自身で実行できるようになります。

自分が実際に使用しているCMakeLists.txt の内容を簡単に紹介します。

##### CMakeLists.txt
```
cmake_minimum_required(VERSION 3.14)
project(abc)

set(CMAKE_CXX_STANDARD 14)

# Contest abc 130
add_executable(130_a 130/a.cpp)
add_executable(130_b 130/b.cpp)
add_executable(130_c 130/c.cpp)
add_executable(130_d 130/d.cpp)
add_executable(130_e 130/e.cpp)
add_executable(130_f 130/f.cpp)
```

このように指定すると、以下のようにビルド時に各ファイルを指定できるようになります。

{{< figure src="/images/posts/build_per_file_at_clion/screenshot.png">}}


## 上記の環境を作成するshell

わざわざ手作業で、上記の構成を作成するのは骨が折れるためシェルを書きました。

以下のようなコマンドを打つと上記の構成ができるようにしてみました。
```
$ cd atcoder
$ ./begin_contest abc 130
```

今回作成したshellも晒してみます。(エラーチェックとかしてないので、適当なシェルになりますがご容赦ください)

```bash
#!/bin/bash

cd `dirname $0`
dir=`pwd`

echo $dir

contest=$1
number=$2


echo "Create contest directory..."
mkdir $contest
cd $contest


echo "Create contest number directory..."
mkdir $number
cd $number


echo "Create files."

# cpp file template
template=$(cat <<EOS
#include <iostream>
#include <vector>

using namespace std;

int main() {
    string s;
    cin >> s;

    int result { 0 };

    ////////////////////
    // Write your code.
    ////////////////////
    
    cout << result << endl;

    return 0;
}
EOS
)

filelist=("a" "b" "c" "d" "e" "f")

for file in ${filelist[@]}
do
    touch ${file}.cpp
    echo "$template" > ${file}.cpp
    echo "created file: ${file}.cpp"
done

echo "Add executable into CMakeLists.txt"

cd ..

# Write settings into CMakeLists.txt
echo "" >> ./CMakeLists.txt
echo "# Contest $contest $number" >> ./CMakeLists.txt

for file in ${filelist[@]}
do
    echo "add_executable(${number}_${file} $number/${file}.cpp)" >> ./CMakeLists.txt
done

```

コンテスト用のディレクトリを作成して、CMakeLists.txt に `add_executable` を追記するといった簡単なものですが、こういった手作業だと面倒なことをさくっと書けるのはシェルスクリプトの良いところだと思います。

## まとめ

競技プログラミングの環境をCLion上に構築したら快適にコンテストに臨めるようになりました。\
環境だけじゃなくコンテストしっかり頑張っていこうと思います。

