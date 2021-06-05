+++
title="プログラムのメモリ配置と，ヒープ・malloc・sbrk について"
date="2021-06-05T08:10:51+09:00"
categories = ["engineering"]
tags = ["os", "linux", "malloc", "c++"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

{{< exlink href="https://amzn.to/3pp195n" text="みかん本">}} で自作OSの開発を進めていくなかで学びになったメモリ周りの知識についてまとめます．


## プロセスのセグメント配置について

実行されたプログラムは，メモリ上にロードされ実行されますがざっくりと以下の様な構造になっています．

{{< figure src="/images/posts/sbrk-malloc-program-break/process-segment-placement.png" >}}


- .text : プログラムのうち機械語を格納するセグメント
- .data : プログラム上の初期化されたデータを格納するセグメント
- .bss : 初期化されていないデータを格納するセグメント．OS (exec) が自動で0に初期化する

スタックは，関数呼び出しなどで使用され，保存される情報とともに局所変数(auto 変数) や関数の引数が置かれます．大きいアドレスから小さいアドレスの方向に向かって伸びていきます．

ヒープは，動的にメモリを割り当てる場所で，主に malloc などによりメモリ確保されるとヒープに配置されます．小さいアドレスから大きいアドレスの方向に向かって伸びていきます．


## 実際のセグメントを見る

実際に cpp のコードをビルドした成果物の中身を以下のコマンドで確認することができます．

```bash
$ objdump -h ./main
```

以下のようなセクションの情報が見れます．（.text, .data, .bss などが確認できます）

```
./main:     ファイル形式 elf64-x86-64

セクション:
Idx Name          Size      VMA               LMA               File off  Algn
  0 .interp       0000001c  0000000000000238  0000000000000238  00000238  2**0
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  1 .note.ABI-tag 00000020  0000000000000254  0000000000000254  00000254  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  2 .note.gnu.build-id 00000024  0000000000000274  0000000000000274  00000274  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  3 .gnu.hash     0000001c  0000000000000298  0000000000000298  00000298  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  4 .dynsym       000000d8  00000000000002b8  00000000000002b8  000002b8  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  5 .dynstr       000000a4  0000000000000390  0000000000000390  00000390  2**0
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  6 .gnu.version  00000012  0000000000000434  0000000000000434  00000434  2**1
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  7 .gnu.version_r 00000030  0000000000000448  0000000000000448  00000448  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  8 .rela.dyn     000000c0  0000000000000478  0000000000000478  00000478  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
  9 .rela.plt     00000048  0000000000000538  0000000000000538  00000538  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 10 .init         00000017  0000000000000580  0000000000000580  00000580  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 11 .plt          00000040  00000000000005a0  00000000000005a0  000005a0  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 12 .plt.got      00000008  00000000000005e0  00000000000005e0  000005e0  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 13 .text         000002a2  00000000000005f0  00000000000005f0  000005f0  2**4
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 14 .fini         00000009  0000000000000894  0000000000000894  00000894  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, CODE
 15 .rodata       0000005b  00000000000008a0  00000000000008a0  000008a0  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 16 .eh_frame_hdr 0000004c  00000000000008fc  00000000000008fc  000008fc  2**2
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 17 .eh_frame     00000148  0000000000000948  0000000000000948  00000948  2**3
                  CONTENTS, ALLOC, LOAD, READONLY, DATA
 18 .init_array   00000008  0000000000200da8  0000000000200da8  00000da8  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 19 .fini_array   00000008  0000000000200db0  0000000000200db0  00000db0  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 20 .dynamic      000001f0  0000000000200db8  0000000000200db8  00000db8  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 21 .got          00000058  0000000000200fa8  0000000000200fa8  00000fa8  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 22 .data         00000010  0000000000201000  0000000000201000  00001000  2**3
                  CONTENTS, ALLOC, LOAD, DATA
 23 .bss          00000008  0000000000201010  0000000000201010  00001010  2**0
                  ALLOC
 24 .comment      00000029  0000000000000000  0000000000000000  00001010  2**0
                  CONTENTS, READONLY
```

また，size コマンドでバイト数を確認することも出来ます．

```bash
$ size ./main
   text	   data	    bss	    dec	    hex	filename
   2107	    616	      8	   2731	    aab	./main
```

## ヒープの挙動を確認する

実際のコードをもとにメモリを確保する際の挙動を確認してみます．

環境は以下のような感じです．

```bash
$ uname -a
Linux kazuki 5.4.0-73-generic #82~18.04.1-Ubuntu SMP Fri Apr 16 15:10:02 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux

$ cat /etc/os-release
NAME="Ubuntu"
VERSION="18.04.5 LTS (Bionic Beaver)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 18.04.5 LTS"
VERSION_ID="18.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=bionic
UBUNTU_CODENAME=bionic

$ g++ --version
g++ (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0
Copyright (C) 2017 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

以下のようなコードで実験しました．

```cpp
#include <unistd.h>
#include <cstdlib>
#include <cstdio>
#include <cstdint>

int main() {
    // sbrk(0) で現在のプログラムブレークの値を取得
    printf("program break\t0x%lx\n", (unsigned long)sbrk(0));
    printf("program break\t0x%lx\n", (unsigned long)sbrk(0));

    // malloc
    printf("===== malloc ===== \n");
    int *p = (int*)malloc(sizeof(int));
    printf("malloc address\t0x%lx\n", (unsigned long)p);

    printf("program break\t0x%lx\n", (unsigned long)sbrk(0));

    unsigned long prev_brk = (unsigned long) sbrk(0);

    printf("===== bulk malloc ===== \n");
    for (int i = 0; i < 50000; ++i) {
        long long *q = (long long*)malloc(sizeof(long long));
        
        unsigned long current_brk = (unsigned long) sbrk(0);
        if (prev_brk != current_brk) {
            printf("===== move program break ===== \n");
            prev_brk = current_brk;
            printf("%dth malloc address\t0x%lx\n", i, (unsigned long)q);
            printf("program break\t0x%lx\n", (unsigned long)sbrk(0));
        }
    }
    printf("========================= \n");
   
    printf("program break\t0x%lx\n", (unsigned long)sbrk(0));

    return 0;
}
```

簡単に解説すると，long long 型のメモリ領域を malloc して，現在のプログラムブレーク（ヒープセグメントの開始位置）を表示して実際のヒープが拡張しているかをしらべています．
初期のヒープ領域がある程度余裕を持って確保されているのか，数回 malloc したくらいでは，プログラムブレークの値が変わらなかったので，50000 回 malloc して，プログラムブレークが変わった，つまりヒープ領域が新たに確保されたときに情報を表示するようにしてみました．

結果はこんな感じでした．

```
g++ -W main.cpp -o main && ./main
program break	0x557528772000
program break	0x557528793000
===== malloc ===== 
malloc address	0x557528773270
program break	0x557528793000
===== bulk malloc ===== 
===== move program break ===== 
4075th malloc address	0x557528792ff0
program break	0x5575287b4000
===== move program break ===== 
8299th malloc address	0x5575287b3ff0
program break	0x5575287d5000
===== move program break ===== 
12523th malloc address	0x5575287d4ff0
program break	0x5575287f6000
===== move program break ===== 
16747th malloc address	0x5575287f5ff0
program break	0x557528817000
===== move program break ===== 
20971th malloc address	0x557528816ff0
program break	0x557528838000
===== move program break ===== 
25195th malloc address	0x557528837ff0
program break	0x557528859000
===== move program break ===== 
29419th malloc address	0x557528858ff0
program break	0x55752887a000
===== move program break ===== 
33643th malloc address	0x557528879ff0
program break	0x55752889b000
===== move program break ===== 
37867th malloc address	0x55752889aff0
program break	0x5575288bc000
===== move program break ===== 
42091th malloc address	0x5575288bbff0
program break	0x5575288dd000
===== move program break ===== 
46315th malloc address	0x5575288dcff0
program break	0x5575288fe000
========================= 
program break	0x5575288fe000

```

おおよそ 4224 ループで，ヒープが拡張されているので long long が 8 byte なので `4224 * 8 = 33824 byte` くらいずつヒープが拡張されていることがわかりました．

## sbrk() について

sbrk は，ブログラムブレークを増減する（=ヒープを確保する）システムコールです．

- {{< exlink href="https://linuxjm.osdn.jp/html/LDP_man-pages/man2/brk.2.html" >}}

正の値を引数に指定すればヒープを増やして増やす前のアドレスを返し（メモリ確保），負の値を指定すればヒープを減らして以前のアドレスを返す（メモリ解放）ものになります．

今回は 0 をわたして，プログラムブレークはそのままで現在の値を取得するといった使い方をしました．

malloc の中で，sbrk() が呼ばれています．

- {{< exlink href="https://qiita.com/kaityo256/items/94a84dbe922eb5996a27" text="mallocの動作を追いかける(main_arenaとsbrk編)" >}}

## まとめ

プログラムが実行される際のメモリ配置と，動的にメモリ領域を確保する malloc と その中で呼ばれるシステムコールの sbrk(2) について簡単に紹介しました．

また，実際に malloc をするコードを書いて，プログラムブレークの値の変化を観察しました．

自作 OS を作っている中でどのようにメモリを確保するのかといった話題から興味がわいて調べてみましたが，プログラムがどのように動いているのかがなんとなく見えてきて非常に面白かったです．

実際に手を動かすと学びも深くなるので，自作OSという題材はすばらしいなと改めて思いました．


## 参考

- {{< exlink text="第27章 brk / sbrk (unistd.h)" href="https://mkguytone.github.io/allocator-navigatable/ch27.html" >}}
- {{< exlink text="詳解UNIXプログラミング 第3版" href="https://amzn.to/3fTF7VC" >}}
- {{< exlink text="ELF(Executable and Linkable Format) Formatについて" href="https://github.com/tsuyopon/memo/blob/master/ELF/ELFFormat.md">}}
