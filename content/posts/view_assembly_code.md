+++
title="アセンブリコードを眺めてみる"
date="2020-02-02T17:33:03+09:00"
categories = ["engineering"]
tags = ["c", "assembly", "assembler", "アセンブラ", "低レイヤー"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

[前回の記事](/posts/book_why_the_program_workds/)で「プログラムはなぜ動くのか？」C 言語から生成されたアセンブリを眺めていたらいろいろ知見があったので今日はそのことについてまとめていこうと思います。

## アセンブリコードをみてみる

今回対象とするのは、以下のような C 言語のソースコードです。
c という変数に、100 と 123 を足した結果を保持するだけのものになります。

#### sample.c

```c
// ２つの引数の加算結果を返す関数
int add(int a, int b)
{
    return a + b;
}

int main()
{
    int c;
    c = add(100, 123);

    return 0;
}
```

これをアセンブリコードに変換するためには以下のコマンドを用います。

```bash
$ gcc -S sample.c -o sample.s
```

これを実行すると以下のようなアセンブリファイルが生成されます。

```asm
	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 10, 15	sdk_version 10, 15
	.globl	_add                    ## -- Begin function add
	.p2align	4, 0x90
_add:                                   ## @add
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	movl	%edi, -4(%rbp)
	movl	%esi, -8(%rbp)
	movl	-4(%rbp), %esi
	addl	-8(%rbp), %esi
	movl	%esi, %eax
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
	.cfi_startproc
## %bb.0:
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register %rbp
	subq	$16, %rsp
	movl	$0, -4(%rbp)
	movl	$100, %edi
	movl	$123, %esi
	callq	_add
	xorl	%esi, %esi
	movl	%eax, -8(%rbp)
	movl	%esi, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
	.cfi_endproc
                                        ## -- End function

.subsections_via_symbols
```

上記のファイルをみると、 .cfi◯◯ という記述がありますがこちらはどうやらデバッグ用の情報らしいです。

https://sourceware.org/binutils/docs/as/CFI-directives.html

これらの情報を削除するためには、以下のようなコマンドでアセンブリを生成します。

```bash
$ gcc -fno-asynchronous-unwind-tables -S sample.c -o sample.s
```

すると以下のようなアセンブリコードが生成されます。

```asm
	.section	__TEXT,__text,regular,pure_instructions
	.build_version macos, 10, 15	sdk_version 10, 15
	.globl	_add                    ## -- Begin function add
	.p2align	4, 0x90
_add:                                   ## @add
## %bb.0:
	pushq	%rbp
	movq	%rsp, %rbp
	movl	%edi, -4(%rbp)
	movl	%esi, -8(%rbp)
	movl	-4(%rbp), %esi
	addl	-8(%rbp), %esi
	movl	%esi, %eax
	popq	%rbp
	retq
                                        ## -- End function
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
## %bb.0:
	pushq	%rbp
	movq	%rsp, %rbp
	subq	$16, %rsp
	movl	$0, -4(%rbp)
	movl	$100, %edi
	movl	$123, %esi
	callq	_add
	xorl	%esi, %esi
	movl	%eax, -8(%rbp)
	movl	%esi, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
                                        ## -- End function

.subsections_via_symbols

```

今回はこのアセンブリコードを眺めていきます。

## アセンブリのシンタックスの種類

アセンブリには、GAS (GNU Assembler) と NASM (Netwide Assembler) が存在します。

今回の説明で用いるのは、GAS の方になります。\
上記２つは、そもそもシンタックスが違うので注意が必要です。

例えば、データ転送命令である `mov` という命令 (オペコード) では、src → dest という方向に値をコピーするのですが、

GAS では、

```
mov {src} {dest}
```

と表記するのに対して、NASM では

```
mov {dest} {src}
```

と表記したりするため、読み間違えないよう注意が必要です。

## オペコードとレジスタ

まず、上記のアセンブリコードを読む前にアセンブリの命令と、オペコード・レジスタについて簡単に説明します。

アセンブリのコードは以下のような形式の命令が基本となります。

```
	movl	$100, %edi
```

この 1 行を 1 命令とし、このことをニーモニックと呼びます。

また、命令を表す部分 (上の例で言う `movl`) をオペコード、演算の対象 (上の例でいう `$100`, `%edi`) をオペランドと呼びます。

### オペコードと Suffix

オペコードには、`add`, `sub`, `mov`, `push`, `pop`, `ret`, `call` などがあります。
それぞれの細かい説明については今回は省きますが、登場する際に簡単に説明します。

ところで、先ほど載せた今回眺めていくアセンブリコードの中に、`movl` や、 `addq` のように、末尾に英字がついているオペコードがあったかと思います。

これは各演算が 何 bit 演算なのかを表す Suffix となっています。

- b = byte (8 bit).
- s = single (32-bit floating point).
- w = word (16 bit).
- l = long (32 bit integer or 64-bit floating point).
- q = quad (64 bit).
- t = ten bytes (80-bit floating point).

( https://en.wikibooks.org/wiki/X86_Assembly/GAS_Syntax#Operation_Suffixes より参照 )

つまり、`movl` は, 32bit 整数 もしくは、64bit 浮動小数点 のデータ転送を行う命令ということになります。

### レジスタと Prefix

オペランドとして指定できるのは、数値などのリテラルや、レジスタ、メモリアドレス（の値）などになります。

レジスタは、CPU 内部の記憶装置のようなもので基本的に CPU が演算するときはメモリからデータをロードしてきてレジスタに格納しつつ演算を進めていきます。CPU にとってはメモリは外部装置なのでレジスタにロードしてから演算を行った方が高速です。

今回登場するレジスタについて簡単にご紹介します。

%rbp
%rsp
%edi
%esi
%eax

| 名前                        | 用途                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| AX (アキュムレータレジスタ) | 演算の途中経過や演算結果などを格納します。                                                                                     |
| SP (スタックポインタ)       | 関数呼び出しなどで使用するスタックの場所をさすポインタです。このポインタを基準にローカル変数などのアドレスを計算したりします。 |
| BP (ベースポインタ)         | 基準となるアドレスをさすポインタが格納されます。こちらも関数呼び出しなどで使用されます。                                       |
| SI (Source Index)           | MOV 命令などの入力元のポインタとして使用されます。                                                                             |
| DI (Destination Index)      | MOV 命令などの転送先のポインタとして使用されます。                                                                             |

この記事の冒頭で紹介したアセンブリコードには、Prefix がついていたと思います。

```asm
	movl	-4(%rbp), %esi
```

例えば上記の命令では、%rbp, %esi と BP と SI の頭に e や、r がついています。(先頭の%はレジスタの頭につく接頭語だと思ってます)

レジスタの Prefix はそのレジスタが何 bit レジスタかを表しています。

prefix が `r` であれば 64bit レジスタで、`e` であれば 32bit レジスタ、prefix がついていなければ 16bit レジスタとなります。
つまり、rax は 64bit、 eax は 32bit、ax は 16bit レジスタとなります。また一部のレジスタでは 16bit レジスタの上位 8bit と下位 8bit にアクセスすることもできます。AX レジスタの例ですと、AH で上位 8bit, AL で下位 8bit にアクセスすることが可能です。

## アセンブリコードをながめる

それでは、前置きが長くなりましたが実際のアセンブリコードを眺めてみます。

### main 関数の前半

まずは main 関数部分を抜き出してみます。

```asm
	.globl	_main                   ## -- Begin function main
	.p2align	4, 0x90
_main:                                  ## @main
## %bb.0:
	pushq	%rbp
	movq	%rsp, %rbp
	subq	$16, %rsp
	movl	$0, -4(%rbp)
	movl	$100, %edi
	movl	$123, %esi
	callq	_add
	xorl	%esi, %esi
	movl	%eax, -8(%rbp)
	movl	%esi, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
```

まず、main 関数がラベルとして定義されています。この内側のブロックが main 関数の処理となりそうです。(`_` がついているのはアセンブリの予約語と関数名がかぶらないようにするための措置でしょうか)

```asm
_main:                                  ## @main
```

続く部分では、現在のベースポインタを `pushq` によってスタックに退避しておき、現在のスタックポインタをベースポインタに設定しています。

```asm
	pushq	%rbp
	movq	%rsp, %rbp
```

この処理はおそらく、関数の最初に必ずされている処理で、関数のスコープに入ったタイミングでベースポインタを現在のスタックポインタに設定してスコープを抜ける時に pop することで、ベースポインタを元に戻しているかと思います。

つづく箇所では、ローカル変数のセットアップをしています。

```asm
	subq	$16, %rsp
	movl	$0, -4(%rbp)
```

先頭で、スタックポインタから 16 を引いていますがこれは、ローカル変数の領域を 16 バイト分保持しているのだと思います。

{{< figure src="/images/posts/view_assembly_code/local_variables.jpg">}}

つづく、

```asm
	movl	$0, -4(%rbp)
```

では、32bit 整数型で 0 を rbp - 4 のアドレスに書き込んでいます。つまり以下の画像のような状態になります。

{{< figure src="/images/posts/view_assembly_code/init_variable.jpg">}}

これは元のソースコードで言うところの、

```c
    int c;
```

という変数宣言 (と変数の初期化) の箇所に相当します。

続く箇所では、add 関数の引数に渡す数値の 100 と 123 を edi, esi というレジスタに転送しています。

```asm
	movl	$100, %edi
	movl	$123, %esi
```

これらは、add 関数のアセンブリの中で参照されているため後ほど説明します。

次に add 関数を呼び出している箇所です。call 命令を使用しています。

```asm
	callq	_add
```

これで、add 関数を呼び出す直前までコードを追うことができました。引き続き add 関数をみていきます。

### add 関数

add 関数の中身は以下のようになっています。こちらも順にコードを追ってみます。

```asm
_add:                                   ## @add
	pushq	%rbp
	movq	%rsp, %rbp
	movl	%edi, -4(%rbp)
	movl	%esi, -8(%rbp)
	movl	-4(%rbp), %esi
	addl	-8(%rbp), %esi
	movl	%esi, %eax
	popq	%rbp
	retq
```

まずは前半の 2 行です。

```asm
	pushq	%rbp
	movq	%rsp, %rbp
```

こちらは、main 関数の先頭にもあらわれたものです。
add 関数の処理に入った直後に `rbp` レジスタに入っているのは main 関数で使用していたベースポインタになります。`rbp` レジスタは add 関数でも使用したいので main 関数で使用していたものをスタックに退避する必要があります。\
1 行目の pushq 命令でスタックへの退避を行っています。

そして新しいベースポンタとして、現在のスタックポインタを設定しています。

続く命令では、add 関数を呼び出す際に引数として渡した値をスタック領域にコピーしています。

```asm
	movl	%edi, -4(%rbp)
	movl	%esi, -8(%rbp)
```

{{< figure src="/images/posts/view_assembly_code/argument_variables.jpg">}}

つづく箇所では、実際にたし算が行われます。

```asm
	movl	-4(%rbp), %esi
	addl	-8(%rbp), %esi
	movl	%esi, %eax
```

まず movl 命令で、`rbp - 4` のアドレスにある `100` という値を esi レジスタに転送しています。 (なぜ esi レジスタが使われているのかは謎です)
次に addl 命令で、 `rbp - 8` のアドレスにある `123` と言う値を esi レジスタに加算し、esi レジスタに結果を保持します。\
そして最後に、esi レジスタの値を、`eax` レジスタに転送しています。\
ここで `eax` レジスタにコピーしているのは、関数の return される値は rax レジスタとするといった規則があるためです。

add 関数の最後では、退避していた ベースポインタを rbp レジスタに戻し関数を return しています。

```asm
	popq	%rbp
	retq
```

### main 関数の後半

ここまでで、関数呼び出しをし演算を行って関数からもどってくるところまでいきました。あと一息です。\
残りのコードは以下のようになっています。

```asm
	xorl	%esi, %esi
	movl	%eax, -8(%rbp)
	movl	%esi, %eax
	addq	$16, %rsp
	popq	%rbp
	retq
```

まず初めに以下の命令です。

```asm
	xorl	%esi, %esi
```

こちらはわかりにくいですが、esi レジスタを初期化しています。`xor` で排他的論理和をとっていますが、同じ内容ならば 0 になる性質を利用して、esi レジスタを 0 で初期化しているコードになります。

続く命令で、add 関数の結果が格納されている eax レジスタの値を、main 関数のベースポインタ -8 の位置に保存しています。

```asm
	movl	%eax, -8(%rbp)
```

これはつまり、`c = add(100, 123);` で ローカル変数 c に add 関数の戻り値を代入しています。
最初に c を初期化した際は、`-4(%rbp)` の場所にデータを保存していたため、どうやら同じアドレスには保存していないようです。

そしてローカル変数に add 関数の戻り値は設定できたので、eax レジスタは esi レジスタの値 (つまり 0) で初期化しています。

```asm
	movl	%esi, %eax
```

0 で初期化しているのは、main 関数の最後に `return 0;` とあるのも影響しているのかもしれません。(関数の戻り値は eax レジスタに格納するため)

最後に main 関数の終了処理を行っています。

```asm
	addq	$16, %rsp
	popq	%rbp
	retq
```

まず add 命令で、rsp レジスタに 16 足しているのですがこれは main 関数の先頭で、ローカル変数の領域を確保するために 以下のように rsp レジスタに 16 を引いていたため、その確保した領域の後始末となります。

```
	subq	$16, %rsp
```

そして、popq で main 関数に入る時に退避した ベースポインタを元に戻して main 関数を return しています。

非常に長くなってしまいましたが、これで簡単な C 言語のプログラムのフローをアセンブリコードで追うことができました。

## まとめ

今回は、簡単な C 言語のコードがアセンブリでどのように表現されているかを確認するために、実際にアセンブリコードをはいてみて中身を眺めてみました。
パッとみた限りでは難しく読めなさそうなアセンブリコードでしたが、ひとつずつ読み解いていくと何をおこなっているのかを理解することができるかと思います。CPU がどのように動いているかなどは日頃意識しなくてもプログラミングは可能ですが、この低レイヤーな部分を覗いてみるのも面白いなと感じました。
