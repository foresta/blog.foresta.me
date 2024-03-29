+++
title="M2 の Mac で Chromium を build する"
date="2024-01-14T22:51:49+09:00"
categories = ["engineering"]
tags = ["chromium", "macos"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回はふと Chromium をビルドしようと思ってビルドしたので、つまづいたところなどメモです。

時系順に記載していくため、時系列順に実行していくと無駄な手順もあるので注意してください。

## やったこと

Chromium のビルドですが、基本的には以下の記事を参考にすすめました。

- {{< exlink href="https://chromium.googlesource.com/chromium/src/+/main/docs/mac_build_instructions.md" >}}

やったことを時系列で列挙すると以下のような流れです。

- XCode のインストール
- debot_tools をインストール
- chromium ディレクトリ作成
- chromium のソースコード fetch
- ビルド用の設定など準備
- CCache のインストール
- 初回ビルド
- エラー発生 `CGDisplayXXXX` 周り
- target_cpu の調整 (エラー治らず)
- ビルド時のフラグ追加
- 再度ビルド（新しいエラー）
- macos アップデート
- 再度ビルド (同じくエラー)
- XCode のアップデート
- ninja でエラー
- 設定コマンド際実行し、再ビルド
- ビルド通った
- Chromium 実行確認


### ビルド環境

最初の状態で以下のような環境です。

```
CPU: Apple M2 Pro
Memory: 16GB
macOS: Ventura 13.4
XCode 未インストール
```

### もろもろインストール

{{< exlink href="https://chromium.googlesource.com/chromium/src/+/main/docs/mac_build_instructions.md" text="ドキュメント" >}} によると、Xcode のインストールが必要っぽいので入れます。

以下の Apple の公式サイトからインストールしました。

- https://developer.apple.com/download/all/?q=xcode

バージョンは最初 15.2 を選択してダウンロードし、インストールしました。
しかし、macOS の 13.4 系ではそもそも動かすことができなさそうだったので、一旦今の macOS が対応してそうな、Xcode 14.3.1 を入れました。

（結果的に、15.2 が動く macOS にバージョンアップしたので、14.3.1 の Xcode は要りませんでした）


次に、depot_tools という Chromium ビルドするためのビルドツール群を clone しました。

```
$ git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
```

clone したら、`.bash_profile` 等にパスを通します。

```
$ export PATH="$PATH:/path/to/depot_tools"
```

### chromium のソースコードの fetch

まず chromium のディレクトリを作りました。

```
$ mkdir chromium && cd chromium
```

そして、fetch します。

```
$ caffeinate fetch --no-history chromium
```

（fetch した ソースコードの commit hash は `d134319b0500a388535d9b1498448acd74217e7a` です）

`caffeinate` コマンド初めて使ったのですが、macOS でスリープを抑制してくれるコマンド見たいです。便利。

`--no-history` コマンドは、git の履歴はのぞいて fetch してくれるらしく、fetch がはやく終わりそうだったのでつけました。

終了すると、`src` というディレクトリが作られます。

今後の作業は基本 `src` ディレクトリ内で実施します。

### build のセットアップ

以下のコマンドでビルドできるようにセットアップします。

```
$ gn gen out/Default
```

これを実行すると `out/Default/args.gn` というファイル (とその他もろもろ) が生成されます。

次に、ビルド高速化のための `CCache` もインストールします。

```
$ brew install ccache
```

homebrew で入るので楽ちんです。

そうしたら、`out/Default/args.gn` のファイルのビルドの設定を書いていきます。

```
$ cat out/Default/args.gn
# Set build arguments here. See `gn help buildargs`.
is_debug = false
is_component_build = true
symbol_level = 0
cc_wrapper="env CCACHE_SLOPPINESS=time_macros ccache"
target_cpu = "arm64"
```

最終的に上のような感じです。 CCache の設定と、あとは 各種 build フラグや、target_cpu を指定しています。

### 初回ビルド

以下コマンドでビルド実行します。

```
$ autoninja -C out/Default chrome
```

以下のようなエラーが発生しました。
(error の場所のみ抜粋です)

```
../../third_party/webrtc/modules/desktop_capture/mac/screen_capturer_mac.mm:462:11: error: 'CGDisplayStreamUpdateGetRects' is only available on macOS 13.0 or newer [-Werror,-Wunguarded-availability-new]
  462 |           CGDisplayStreamUpdateGetRects(updateRef, kCGDisplayStreamUpdateDirtyRects, &count);
      |           ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~

../../third_party/webrtc/modules/desktop_capture/mac/screen_capturer_mac.mm:472:44: error: 'kCGDisplayStreamShowCursor' is only available on macOS 13.0 or newer [-Werror,-Wunguarded-availability-new]
  472 |                            (const void*[]){kCGDisplayStreamShowCursor},
      |                                            ^~~~~~~~~~~~~~~~~~~~~~~~~~

../../third_party/webrtc/modules/desktop_capture/mac/screen_capturer_mac.mm:478:41: error: 'CGDisplayStreamCreate' is only available on macOS 13.0 or newer [-Werror,-Wunguarded-availability-new]
  478 |     CGDisplayStreamRef display_stream = CGDisplayStreamCreate(
      |                                         ^~~~~~~~~~~~~~~~~~~~~

../../third_party/webrtc/modules/desktop_capture/mac/screen_capturer_mac.mm:482:23: error: 'CGDisplayStreamStart' is only available on macOS 13.0 or newer [-Werror,-Wunguarded-availability-new]
  482 |       CGError error = CGDisplayStreamStart(display_stream);
      |                       ^~~~~~~~~~~~~~~~~~~~

../../third_party/webrtc/modules/desktop_capture/mac/screen_capturer_mac.mm:485:35: error: 'CGDisplayStreamGetRunLoopSource' is only available on macOS 13.0 or newer [-Werror,-Wunguarded-availability-new]
  485 |       CFRunLoopSourceRef source = CGDisplayStreamGetRunLoopSource(display_stream);
      |                                   ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

../../third_party/webrtc/modules/desktop_capture/mac/screen_capturer_mac.mm:498:33: error: 'CGDisplayStreamGetRunLoopSource' is only available on macOS 13.0 or newer [-Werror,-Wunguarded-availability-new]
  498 |     CFRunLoopSourceRef source = CGDisplayStreamGetRunLoopSource(stream);
      |                                 ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

../../third_party/webrtc/modules/desktop_capture/mac/screen_capturer_mac.mm:500:5: error: 'CGDisplayStreamStop' is only available on macOS 13.0 or newer [-Werror,-Wunguarded-availability-new]
  500 |     CGDisplayStreamStop(stream);
      |     ^~~~~~~~~~~~~~~~~~~
```

エラー内容で調べると以下の Stack Overflow に辿り着きました。

- {{< exlink href="https://stackoverflow.com/questions/75982140/screen-capturer-mac-mm46211-error-cgdisplaystreamupdategetrects-is-only-av" >}}

これにしたがって、`build/config/compiler/BUILD.gn` というファイルにフラグを追加します。

```
diff --git a/build/config/compiler/BUILD.gn b/build/config/compiler/BUILD.gn
index 275456980d..3382b7290d 100644
--- a/build/config/compiler/BUILD.gn
+++ b/build/config/compiler/BUILD.gn
@@ -1837,6 +1837,7 @@ config("default_warnings") {
       # which we no longer use. Check if it makes sense to remove
       # this as well. http://crbug.com/316352
       "-Wno-unneeded-internal-declaration",
+      "-Wno-unguarded-availability-new",
     ]

     if (!is_nacl || is_nacl_saigo) {
```

## 二回目のエラー

上記対応して再度ビルドしました。

```
$ autoninja -C out/Default chrome
```

また、ビルドエラーになりました。

```
../../media/base/mac/video_capture_device_avfoundation_helpers.mm:29:51: error: use of undeclared identifier 'AVCaptureDeviceTypeExternal'
   29 |           [captureDeviceTypes arrayByAddingObject:AVCaptureDeviceTypeExternal];
      |                                                   ^
1 error generated.
[21579/48313] CXX obj/media/base/base/audio_push_fifo.o
ninja: build stopped: subcommand failed.
```

調べると以下ですでに会話されていて、macOS と Xcode のバージョンをあげろとのことでした。

- {{< exlink href="https://groups.google.com/a/chromium.org/g/chromium-dev/c/DmAOXY_9s4c" >}}


そのため、macOS を 13.4 系から、13.6.3 にアップデートしました。

`macOS 13.6.3` では、最初に誤ってダウンロードした、`Xcode 15.2` が使えそうだったので Xcode もこちらを使用するようにしました。
古い Xcode を削除して新しい `15.2` の方をインストールです。

このままビルドしましたが、どうやらまだ古い MacOSX13.3 の SDK の方を見にいってしまうらしく、ninja のエラーになりました。

```
$ autoninja -C out/Default chrome
ninja: Entering directory `out/Default'
ninja: error: '/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX13.3.sdk/usr/include/mach/exc.defs', needed by 'gen/third_party/crashpad/crashpad/util/mach/excUser.c', missing and no known rule to make it
```

どこかのタイミングで、SDK へのパスが保持されてるんだろうなーと思ったので以下のセットアップをもう一回たたき

```
$ gn gen out/Default
```

再度ビルドしました。

```
$ autoninja -C out/Default chrome
```

このビルド 3時間くらいかかってご飯食べたりしながらまっていたのですが、無事終わってました。


最後に、以下のコマンドを実行したところ無事に Chromium が立ち上がりました。

```
$ out/Default/Chromium.app/Contents/MacOS/Chromium
```

build やら install やら、OS Update やらやったためかなり時間がかかったため、動いた瞬間は無駄に嬉しかったです。

## まとめ

今回は、MacOS の M2 pro CPUで Chromium を動かしてみて、実行できるところまでやってみました。

build、install、update など待ち時間がかなり多かったため時間はかかりましたが、意外とすんなりできたという印象です。

これだけ巨大なソースコードだとさすがにビルド時間がかかるなぁという感想と共に、初見でも割と最後までビルドすることができるくらい整備されているのはさすがだなと思いました。
せっかくビルドしたのでソースコード読んだりして楽しみたいと思います！
