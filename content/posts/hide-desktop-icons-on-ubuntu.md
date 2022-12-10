+++
title="Ubuntu で desktop icon を非表示にする"
date="2022-12-10T13:44:12+09:00"
categories = ["engineering"]
tags = ["ubuntu"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段持ち歩き用の PC として，thinkpad に ubuntu を入れて運用しているのですがデスクトップにあるアイコンを削除できないかなーとふと思い立ち調べてみたところ，cli からそのあたりの設定が変更できそうだったのでメモです.

## TL;DR

以下で desktop icon の非表示化が出来ます．

```bash
$ gsettings set org.gnome.desktop.background show-desktop-icons false
```

## gsettings

デスクトップアイコンですが，gsettings コマンドで設定が可能らしいので見ていきます．

```bash
$ gsettings

Usage:
  gsettings --version
  gsettings [--schemadir SCHEMADIR] COMMAND [ARGS…]

Commands:
  help                      Show this information
  list-schemas              List installed schemas
  list-relocatable-schemas  List relocatable schemas
  list-keys                 List keys in a schema
  list-children             List children of a schema
  list-recursively          List keys and values, recursively
  range                     Queries the range of a key
  describe                  Queries the description of a key
  get                       Get the value of a key
  set                       Set the value of a key
  reset                     Reset the value of a key
  reset-recursively         Reset all values in a given schema
  writable                  Check if a key is writable
  monitor                   Watch for changes

Use “gsettings help COMMAND” to get detailed help.
```

get や set コマンドがあるのでこのあたりで設定値を確認や変更ができそうです．

```bash
$ gsettings help get
用法:
  gsettings [--schemadir SCHEMADIR] get SCHEMA[:PATH] KEY

KEY の値を取得する

引数:
  SCHEMADIR 追加スキーマを検索するディレクトリ
  SCHEMA    スキーマ名
  PATH      再配置可能なスキーマの場合、そのパス
  KEY       スキーマ内のキー

```

get コマンドには，schema と key が必要そうなので list-schemas, list-keys コマンドで探します．

```bash
$ gsettings list-schemas | grep desktop
... (省略)
org.gnome.desktop.wm.keybindings
org.gnome.desktop.background
org.freedesktop.ibus.general
org.gnome.desktop.peripherals
... (省略)
```

どうやら `org.gnome.desktop.background` 内に設定がありそうです．

それらしき key を探します．

```bash
$ gsettings list-keys org.gnome.desktop.background
picture-opacity
secondary-color
show-desktop-icons
primary-color
color-shading-type
picture-options
picture-uri
draw-background
```

`show-desktop-icons` がそれっぽいので実際の値を確認してみます．

```bash
$ gsettings get org.gnome.desktop.background show-desktop-icons
true
```

この値を false に設定します．

```bash
$ gsettings set org.gnome.desktop.background show-desktop-icons false
```

すると無事デスクトップからアイコンが消えました．

## まとめ

gsettings コマンドを使って，ubuntu の desktop アイコンを非表示にしました．
cli から簡単にこのあたりの設定できるのはやはり便利だなと思います．
