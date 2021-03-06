+++
title="Windows Update 後に起動しなくなった Ubuntu の復旧ログ"
date="2021-03-06T13:16:42+09:00"
categories = ["engineering"]
tags = ["ubuntu", "os", "grub", "windows"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

自分は，普段 Thinkpad P43s に Windows10 と Ubuntu18.04 LTS をデュアルブートして使用しているのですが，あるとき windows10 で Minecraft で遊びおえて，さて作業するかと再起動したら Ubuntu が立ち上がらない．．．という状態になっていました．

今回は，その復旧のためにやったことをログとしてまとめておこうと思います．

## 環境と背景

もともとの, Ubuntu の環境ですが以下のような手順で行っていました

- Windows のドライブを縮小する
- Ubuntu の iso をダウンロードする
- UNetBootin というツールで USB に Ubuntu の LiveCD を書き込む
- LiveCD から Ubuntu をインストール


Ubuntu のセットアップなどについては，[以前記事を書きました](/posts/setup_ubuntu_log/)


なので，grub2 のブートローダーが起動後に動いていて，その画面で ubuntu を起動するか，Windowsを起動するか (Windows Boot Manager) を選択できるようになっていました．

しかし，Windows で Windows Update をして再起動したところ，grub2 のブートローダーが立ち上がらず直接 Windows が立ち上がるようになってしまいました．


## 復旧作業

### とりあえずぐぐる

とりあえず，「ubuntu not booting after windows update」 などで調べると同様の事象はよく起こるようです．

どうやら Windows Update 時に，Windows Boot Manager が自動で復旧されてしまうという現象らしいです．

- 参考: {{< exlink href="https://solution.fielding.co.jp/column/it/itcol04/202008_03/" >}}


### ブートマネージャーを確認

ググった結果，どうやらブートローダーがよみこめないだけっぽかったので，ブートマネージャがどうなっているか確認してみました．

Windows 側で， `cmd.exe` を管理者権限で実行して，以下のコマンドを打つとブートマネージャを確認できます．

`{xxxxx...}` などの内容は適当な文字列にしてます．

```
> bcdedit /enum firmware
ファームウェアのブート マネージャー
--------------------------------
identifier              {fwbootmgr}
displayorder            {bootmgr}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
timeout                 0

...
..
.
```

上記のコマンドを打つと，ブートマネージャのリストと，それぞれがどういったものなのかという説明が表示されます．

`{bootmgr}` というのが Windows Boot Manger になるのですが，本来であればこの上に grub のブートローダーが見えているはずです．

ちなみに復旧後に再度確認してみると，この `{bootmgr}` の上に ubuntu 起動用の grub のものが表示されるようになっていました，

```
kbcdedit /enum firmware
ファームウェアのブート マネージャー
--------------------------------
identifier              {fwbootmgr}
displayorder            {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {bootmgr}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
                        {xxxxxxxx-1234-5678-9abc-xxxxxxxxxxxx}
timeout                 0
...
..
.
```


Windows側で，ブートローダーが見つからないことが確認できたので，BIOS でも確認します．

自分の Thinkpad では，起動画面で Enter を押して BIOS に入り，Boot Order のメニューを開いて確認しましたが，こちらも同様に ブートローダーは見つかりませんでした．

### Boot Repair で復旧する

調べていくとどうやら，grub を再インストールしたりすると治るらしいとの情報があり，再インストールも考えましたが,
Ubuntuにある Boot Repair というツールを使用すると比較的簡単に復旧できるみたいだったので，こちらを使う方法を採用しました．


現状 Ubuntu は起動できないので，Ubuntu をインストールしたときに使用した LiveCD (USB) を使ってまずは，ubuntu をライブセッションで起動します．

USB からの起動方法は，Thinkpad であれば 起動画面で F12 を押して表示されるメニューから USB を選択して起動できます．


{{< exlink href="https://support.lenovo.com/it/ja/solutions/ht118361" >}}


起動したらまずやったこととして，ファイルシステムが生きているか念の為確認しました．

ubuntu がインストールされているパーティションを mount して確認してみたところファイルシステムは生きてそうで普通に中身が確認出来ました．

ひと安心できたので早速 Boot Repair を用いて復旧していきます．

Boot Repair のインストールは簡単で，Universe リポジトリーの有効化 をした後に，以下のようなコマンドでインストールします．

```bash
# PPA を追加
$ sudo add-apt-repository -y ppa:yannubuntu/boot-repair

# Install
$ sudo apt install -y boot-repair
```

インストールが完了したら Boot Repair を起動して，`おすすめ修復 (reommended repair)` というボタンを押すと自動で良い感じに問題を発見して修復してくれます．便利．

{{< exlink href="https://kledgeb.blogspot.com/2018/06/ubuntu-1804-146-boot-repair.html?m=1" >}}

一点，自分の環境でおすすめ修復を押したときに以下のようなエラーが表示されました．

```
Please create a ESP partition (>1MB, fat boot flag). This can be performed via tools such as Gparted. Then try again.
```

Boot ようのパーティションは作ってあるのでなぜだろうと思ってしらべたら，どうやら hidden フラグを外せば良いとのことでした．

{{< exlink href="https://askubuntu.com/questions/1240391/problem-with-dual-boot-win-10-boot-repair-unsuccessful" >}}

以下のように，gparted コマンドを Terminal から入力すると，パーティションの設定が立ち上がります．

```bash
$ gparted
```

立ち上がったら以下の手順で hidden フラグを外します

- ブート用の EFI パーティションを右クリック
- manage flags というメニューを開く
- 表示された `hidden` フラグのチェックを外す

この作業をおこない，もう一度 Boot Repair にて，おすすめ修復 ボタンをおすと自動で修復が始まり，再起動したら grub のブートローダーが起動し，Ubuntu が起動できるようになりました．

## まとめ

Windows Update により Ubuntu が起動しなくなったときの対応ログを備忘録としてまとめました．

起動しなくなったときはかなり焦りましたが，冷静にググっていったら以外とすんなり解決できてよかったです．
特に Boot Repair というツール優秀だなぁと思いました．

この復旧作業を通してブートローダー周りがなんとなくわかってきて，OS自作入門を再開したい気持ちが高まりました．


## 参考


- {{< exlink href="https://netlog.jpn.org/r271-635/2019/08/uefi_windows10_ubuntu_install.html" >}}
- {{< exlink href="https://kledgeb.blogspot.com/2018/06/ubuntu-1804-146-boot-repair.html?m=1" >}}
- {{< exlink href="https://7me.nobiki.com/2019/11/17/ubuntu-windows10-dual-boot-grub-reinstall/" >}}
- {{< exlink href="https://blog.stsf.dev/2020/04/11/20200411/" >}}
- {{< exlink href="https://qiita.com/TsutomuNakamura/items/04176b91d791de46142c" >}}
- {{< exlink href="https://help.ubuntu.com/community/Boot-Repair#A2nd_option_:_install_Boot-Repair_in_Ubuntu" >}}
- {{< exlink href="https://askubuntu.com/questions/1240391/problem-with-dual-boot-win-10-boot-repair-unsuccessful" >}}

