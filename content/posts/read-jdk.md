+++
title="JDK を読む"
date="2022-12-18T23:03:39+09:00"
categories = ["engineering"]
tags = ["java", "c", "c++", "jvm"]
thumbnail = ""
+++

この記事は {{< exlink href="https://qiita.com/advent-calendar/2022/stanby" text="スタンバイ Advent Calendar 2022" >}} の 19 日目の記事です

## はじめに

これまでに、Kotlin や Scala などの JVM 言語を使用して開発を行ってきました。
そのため JVM にはお世話になってきたのですが、恥ずかしながらちゃんと中の仕組みなどをあまり把握できていません。

特に、パラメータのチューニングやデバッグなどまだまだ感覚的にやっているところも多く、この辺りの理解を深めたいというモチベーションがありました。

今回は、Advent Calendar で良い機会なので今回は jdk のソースコードを読んでいこうかなと思います。

対象のソースコードは、OpenJdk で 12/11 時点の master ブランチを読んでいこうと思います。

- {{< exlink href="https://github.com/openjdk/jdk/tree/a37de62d9ddadf1490ee59bd03224e8cea70a75b" >}}

筆者の環境は、intell の macbook で、macOS Big Sur になります。

## 読むための準備

いきなり読み始めても良いのですが、手元で動かせるようにしておきたいためまずは build していきます。

公式の {{< exlink href="https://github.com/openjdk/jdk/blob/a37de62d9ddadf1490ee59bd03224e8cea70a75b/doc/building.md" text="buildng.md" >}} に JDK のビルド方法が書かれているためこちらに沿って準備していきます。

手順としては以下の通りです

1. ソースコードの取得
2. configure実行
3. make
4. 実行

### ソースコードの取得

まずソースコードの取得ですがこちらは repository から clone してきます。

```bash
$ git clone https://git.openjdk.org/jdk/
```

### configure 実行

次に、configure ですがクローンしてきたディレクトリで以下のコマンドを叩きます。

```bash
$ bash configure
```

おそらくビルドの環境などが整っていないため、一度ではうまく行かないので出てきたエラーに沿って色々インストールしていきます。

#### Java

グローバルな Java も必要なので適宜インストールします。
自分がビルドしようとしたバージョンでは、JDK の 19, 20, 21 が必要なためインストールします。


自分の環境では sdkman を使用しているため以下のように amazon corretto の 19 をインストールしました。

```bash
$ sdk install java 19-amzn
```

```bash
$ java --version
openjdk 19.0.1 2022-10-18
OpenJDK Runtime Environment Corretto-19.0.1.10.1 (build 19.0.1+10-FR)
OpenJDK 64-Bit Server VM Corretto-19.0.1.10.1 (build 19.0.1+10-FR, mixed mode, sharing)
```

#### autoconf

autoconf も必要なので brew で入れます。
```bash
$ brew install autoconf
```

#### Xcode

jdk のビルドの clang が必要なため Xcode もインストールします。

最初は以下のコマンドで、 command line tool だけを入れましたが、`bash configure` 実行時に、`metal` がないと怒られるため、XCode を入れて、xcode-select でみる path を変更しました。

コマンド
```bash
$ xcode-select --install
```

出てきたエラー

```
xcrun: error: unable to find utility "metal"
```

最終的にやった内容は以下のとおりです。
```bash
# CommandLineTool のみのインストール
$ xcode-select --install

# path を Xcode.app の方に向ける
$ xcode-select --print-path
/Library/Developer/CommandLineTools
$ sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
$ xcode-select --print-path
/Applications/Xcode.app/Contents/Developer

# Xcode license agree
$ sudo xcodebuild -license
```

↓の issue を参考にしました。

- {{< exlink href="https://github.com/gfx-rs/gfx/issues/2309" >}}

---

上記までの対応で、無事 `bash configure` が成功しました。

以下のような build 情報の summary が表示されます。
```
The existing configuration has been successfully updated in
/Users/{pathToJDK}/jdk/build/macosx-x86_64-server-release
using default settings.

Configuration summary:
* Name:           macosx-x86_64-server-release
* Debug level:    release
* HS debug level: product
* JVM variants:   server
* JVM features:   server: 'cds compiler1 compiler2 dtrace epsilongc g1gc jfr jni-check jvmci jvmti management parallelgc serialgc services shenandoahgc vm-structs zgc'
* OpenJDK target: OS: macosx, CPU architecture: x86, address length: 64
* Version string: 21-internal-adhoc.{username}.jdk (21-internal)
* Source date:    1670910279 (2022-12-13T05:44:39Z)

Tools summary:
* Boot JDK:       openjdk version "19.0.1" 2022-10-18 OpenJDK Runtime Environment Corretto-19.0.1.10.1 (build 19.0.1+10-FR) OpenJDK 64-Bit Server VM Corretto-19.0.1.10.1 (build 19.0.1+10-FR, mixed mode, sharing) (at /{userPath}/.sdkman/candidates/java/19.0.1-amzn)
* Toolchain:      clang (clang/LLVM from Xcode 13.2.1)
* Sysroot:        /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX12.1.sdk
* C Compiler:     Version 13.0.0 (at /usr/bin/clang)
* C++ Compiler:   Version 13.0.0 (at /usr/bin/clang++)

Build performance summary:
* Build jobs:     16
* Memory limit:   65536 MB
```

### make

ソースコードのルートディレクトリで、以下のコマンドを打ちます。

```bash
$ make images
```

### 実行

make の実行で、build/*/images/jdk/bin/java などにバイナリができているので、以下のようなコマンドで実行できます。

```bash
$ ./build/macosx-x86_64-server-release/images/jdk/bin/java --version
openjdk 21-internal 2023-09-19
OpenJDK Runtime Environment (build 21-internal-adhoc.{username}.jdk)
OpenJDK 64-Bit Server VM (build 21-internal-adhoc.{username}.jdk, mixed mode, sharing)
```

無事 version 21 で java を実行することができてそうです。

## java --version が動くまで

手元で、動かせる環境が整ったので、さっそくコードを読んでいこうと思います。
今回は、上記で動かした `java --version` が動くまでを読んでみます。

### EntryPoint

以下が EntryPoint になっていそうです。

- {{< exlink text="src/java.base/share/native/launcher/main.c" href="https://github.com/openjdk/jdk/blob/a37de62d9ddadf1490ee59bd03224e8cea70a75b/src/java.base/share/native/launcher/main.c" >}}

主にやっていることは以下の通りです。

- 引数をリストに保持する
    - JAVA_ARGS, EXTRA_JAVA_ARGS 環境変数に指定されている引数リスト
    - 通常の CommandLine 引数リスト
- JLI_Launchを呼ぶ
- 保持したリストを渡す
    - src/java.base/share/native/libjli/java.c

### JLI_Launch

次に呼ばれる JLI_Launch は以下に書かれてます。

- {{< exlink text="src/java.base/share/native/libjli/java.c" href="https://github.com/openjdk/jdk/blob/a37de62d9ddadf1490ee59bd03224e8cea70a75b/src/java.base/share/native/libjli/java.c" >}}

ここでも色々やられていそうですが、ざっくりと以下のような内容です。

- CreateExecutionEnvironment
    - 処理の実態は、{{< exlink text="src/java.base/macosx/native/libjli/java_md_macosx.m" href="https://github.com/openjdk/jdk/blob/2342684f2cd91a2e5f43dd271e95836aa78e7d0a/src/java.base/macosx/native/libjli/java_md_macosx.m#L361" >}}
    - 実行環境の jre, jvm の path を取得
    - 後続の LoadJavaVM で jvm のパスが使われる
- LoadJavaVM
    - libjvm.dylib を ダイナミックロードする (macos なので dylib) 
    - InvocationFunctions という構造体に関数をロードしている
        - この構造体が、JVMInit に渡されている
- ParseAuguments
    - ここで実際のOption引数のパースがおこなわれている

↓下記を引用しますがここで、`--version` の引数を parse していました。
{{< exlink href="https://github.com/openjdk/jdk/blob/a37de62d9ddadf1490ee59bd03224e8cea70a75b/src/java.base/share/native/libjli/java.c#L1289-L1309" text="src/java.base/share/native/libjli/java.c" >}}

```java.c
    } else if (JLI_StrCmp(arg, "-help") == 0 ||
               JLI_StrCmp(arg, "-h") == 0 ||
               JLI_StrCmp(arg, "-?") == 0) {
        printUsage = JNI_TRUE;
        return JNI_TRUE;
    } else if (JLI_StrCmp(arg, "--help") == 0) {
        printUsage = JNI_TRUE;
        printTo = USE_STDOUT;
        return JNI_TRUE;
    } else if (JLI_StrCmp(arg, "-version") == 0) {
        printVersion = JNI_TRUE;
        return JNI_TRUE;
    } else if (JLI_StrCmp(arg, "--version") == 0) {
        printVersion = JNI_TRUE;
        printTo = USE_STDOUT;
        return JNI_TRUE;
    } else if (JLI_StrCmp(arg, "-showversion") == 0) {
        showVersion = JNI_TRUE;
    } else if (JLI_StrCmp(arg, "--show-version") == 0) {
        showVersion = JNI_TRUE;
        printTo = USE_STDOUT;
```

printVersion というフラグが TRUE になっていて、後続の処理で、このフラグをみていそうです。

- JVMInit を呼ぶ
    - パースした引数や、ロードした jvm の関数を渡して実行されています。


### JVMInit

JVMInitの処理は {{< exlink text="src/java.base/macosx/native/libjli/java_md_macosx.m" href="https://github.com/openjdk/jdk/blob/2342684f2cd91a2e5f43dd271e95836aa78e7d0a/src/java.base/macosx/native/libjli/java_md_macosx.m#L937" >}} にあります。

このあたりは、内部で新しくスレッドを立ち上げて、`JavaMain` 関数を実行しています。

以下に引用します。

```objc
    NSBlockOperation *op = [NSBlockOperation blockOperationWithBlock: ^{
        JavaMainArgs args;
        args.argc = argc;
        args.argv = argv;
        args.mode = mode;
        args.what = what;
        args.ifn  = *ifn;
        rslt = JavaMain(&args);
    }];
```

Objective-C のコードですがこの辺りです。

### JavaMain

JavaMainは、{{< exlink text="src/java.base/share/native/libjli/java.c" href="https://github.com/openjdk/jdk/blob/2342684f2cd91a2e5f43dd271e95836aa78e7d0a/src/java.base/share/native/libjli/java.c#L391" >}} に書かれています。

以下に引用します。

```c
    if (printVersion || showVersion) {
        PrintJavaVersion(env);
        CHECK_EXCEPTION_LEAVE(0);
        if (printVersion) {
            LEAVE();
        }
    }
```

ParseAuguments 時に True になった、`printVersion` フラグを `JavaMain` 関数の中で見ていました。
内部で、`PrintJavaVersion` 関数を呼び、その後 `LEAVE()` で VM を終了させています。
`LEAVE()` の内部では、`DestroyJavaVM` というメソッドが呼ばれていました。

ここまで読んできてようやく、`java --version` と打った時に内部でどのように処理をしているかまでを追うことができました。

余談ですが、ソースを読んで初めて `java --show-version` というフラグがあることを知りました。この Option は、バージョンを表示しつつ java コマンドを終了しないことが上記のコードからわかりますね。

## まとめ

今回は、JDK のソースコードリーディングをして、`java --version` でバージョン情報が表示されるところまでを深ぼってみました。

まだまだ読めてないところは多く足を踏み入れたくらいかと思いますが、なんとなく java コマンドを打った時に内部でどのような処理がされるのかうっすらとイメージができました。さらに深く読んでいくと理解がより深まると思います。

下のレイヤーに潜っていくことは楽しくもあり、いろいろな知見が転がっているので引き続き読んでみようと思いました。


