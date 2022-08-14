+++
title="WSL 上にScala の環境を構築する"
date="2022-08-13T02:42:35+09:00"
categories = ["engineering"]
tags = ["scala", "wsl"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、wsl 環境の上に Scala の環境を構築したので内容をまとめます。

## Javaのインストール

今回は、SDKMAN を用いて Java をインストールしようと思います。

- {{< exlink href="https://sdkman.io">}}

公式サイトの install の手順に沿ってインストールします。

その前に、zip / unzip コマンドが必要なので install します。

```bash
$ sudo apt install unzip
$ sudo apt install zip
```

以下でinstall します。

```bash
$ curl -s "https://get.sdkman.io" | bash
```

```bash
$ source "$HOME/.sdkman/bin/sdkman-init.sh"
```

```bash
$ sdk version
==== BROADCAST =================================================================
* 2022-08-10: leiningen 2.9.10 available on SDKMAN!
* 2022-08-10: jbang 0.97.0 available on SDKMAN! https://github.com/jbangdev/jbang/releases/tag/v0.97.0
* 2022-08-09: vertx 4.3.3 available on SDKMAN!
================================================================================

SDKMAN 5.16.0
```

sdkman が install できたら Corretto をインストールします。


以下のコマンドで使用可能な Java のバージョンを見ることができます。

```bash
$ sdk list java

================================================================================
Available Java Versions for Linux 64bit
================================================================================
 Vendor        | Use | Version      | Dist    | Status     | Identifier
--------------------------------------------------------------------------------
 Corretto      |     | 18.0.2       | amzn    |            | 18.0.2-amzn         
               |     | 18.0.1       | amzn    |            | 18.0.1-amzn         
               |     | 17.0.4       | amzn    |            | 17.0.4-amzn         
               |     | 17.0.3.6.1   | amzn    |            | 17.0.3.6.1-amzn     
               |     | 17.0.0.35.1  | amzn    |            | 17.0.0.35.1-amzn    
               |     | 11.0.16      | amzn    |            | 11.0.16-amzn        
               |     | 11.0.15.9.1  | amzn    |            | 11.0.15.9.1-amzn    
               |     | 11.0.12.7.1  | amzn    |            | 11.0.12.7.1-amzn    
               |     | 8.332.08.1   | amzn    |            | 8.332.08.1-amzn     
               |     | 8.0.342      | amzn    |            | 8.0.342-amzn        
 Dragonwell    |     | 17.0.3       | albba   |            | 17.0.3-albba        
               |     | 11.0.15      | albba   |            | 11.0.15-albba       
               |     | 11.0.12.8    | albba   |            | 11.0.12.8-albba     
               |     | 8.8.9        | albba   |            | 8.8.9-albba         
               |     | 8.0.332      | albba   |            | 8.0.332-albba       
.............
..........
......
...
================================================================================
Omit Identifier to install default version 17.0.4-tem:
    $ sdk install java
Use TAB completion to discover available versions
    $ sdk install java [TAB]
Or install a specific version by Identifier:
    $ sdk install java 17.0.4-tem
Hit Q to exit this list view
================================================================================
```

Java 18 をインストールします。

```
$ sdk install java 18.0.2-amzn
```

インストールできたか確認します。

```
$ java --version
openjdk 18.0.2 2022-07-19
OpenJDK Runtime Environment Corretto-18.0.2.9.1 (build 18.0.2+9-FR)
OpenJDK 64-Bit Server VM Corretto-18.0.2.9.1 (build 18.0.2+9-FR, mixed mode, sharing)
```

よさそうです。

## sbt のインストール

sbt も sdkman を用いてインストールできるみたいなので実行します。

使用できるバージョンは以下の通り
```
$ sdk list sbt
================================================================================
Available Sbt Versions
================================================================================
     1.7.1               1.5.0-RC2           1.3.10              1.2.1          
     1.7.0               1.5.0-RC1           1.3.9               1.2.0          
     1.6.2               1.4.9               1.3.8               1.1.6          
     1.6.1               1.4.8               1.3.7               1.1.5          
     1.6.0               1.4.7               1.3.6               1.1.4          
     1.6.0-RC2           1.4.6               1.3.5               1.1.2          
     1.6.0-RC1           1.4.5               1.3.4               1.1.1          
     1.5.8               1.4.4               1.3.3               1.1.0          
     1.5.7               1.4.3               1.3.1               1.0.4          
     1.5.6               1.4.2               1.3.0               1.0.3          
     1.5.5               1.4.1               1.2.8               1.0.2          
     1.5.4               1.4.0               1.2.7               1.0.1          
     1.5.3               1.4.0-RC2           1.2.6               1.0.0          
     1.5.2               1.3.13              1.2.5               0.13.18        
     1.5.1               1.3.12              1.2.4               0.13.17        
     1.5.0               1.3.11              1.2.3                              

================================================================================
+ - local version
* - installed
> - currently in use
================================================================================
```

最新版をいれておきます。

```bash
$ sdk install sbt 1.7.1
```

以下のような表記がでたので大丈夫そうです。

```
$ sbt --version

sbt version in this project: 1.7.1
sbt script version: 1.7.1
```

## IntelliJ を Install したかった

Windows 側で IntelliJ をインストールして、wsl 側のソースコードや実行環境を呼び出して開発をしようと思って進めてましたが、うまくいきませんでした。


以下のようなエラーがでて、wsl 側にインストールした Java を認識はできているものの、sbt import の段階でよみこむことができませんでした。
```
sbt import cancelled: Cannot run program "//wsl$/Ubuntu/home/username/.sdkman/candidates/java/18.0.2-amzn/bin/java" (in directory "\\wsl$\Ubuntu\home\username\work\ScalaSampleProject"): CreateProcess error=193, %1 は有効な Win32 アプリケーションではありません
```

どうやら、sbt の wsl はまだ対応状況が微妙らしく、gradle や ant はすでに対応されていそうな感じでした。

IntelliJ で開発はあきらめて、neovim などで環境を作ってこうと思います。

## まとめ

今回は、wsl 側に Scala の開発環境を構築しました。
IntelliJ から sbt を用いて wsl 側の Java にアクセスするのはまだ難しそうで諦めました。

構築して思ったことは、sdkman が非常に便利で Java 系の環境構築に結構大変なイメージがあったのですが思ったよりサクッとできたのがよかったです。

IntelliJ の sbt wsl 対応状況については引き続き気になるので様子を見てみようと思います。
