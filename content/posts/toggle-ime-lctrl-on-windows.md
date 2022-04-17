+++
title="AutoHotKey を使用して Windows で LCtrl 空打ちで IME を Toggle する"
date="2022-04-17T16:15:41+09:00"
categories = ["engineering"]
tags = ["windows", "ime", "auto-hot-key"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、Windows にて、IME の切り替えを LCtrl の 空打ちで行いたかったため、AutoHotKey を用いて実現しましたのでメモです。

## 先に結論

忙しい人のために、先に結論です。
以下の手順で IME Toggle を LCtrl 空押しで実現することができます。

- AutoHotKey をインストールする
  - {{< exlink href="https://www.autohotkey.com/" >}}
- {{< exlink href="https://github.com/foresta/ctrl-ime-ahk" >}} からスクリプトをダウンロード
- ctrl-ime-ahk.ahk を 実行

## AutoHotKey とは

AutoHotKey はスクリプトを書いて HotKey の設定が行えるアプリケーションになります。

どんなことができるかは、実際に以下の公式 HP から確認してみてください。

- {{< exlink href="https://wwwautohotkey.com" >}}

上記のサイトから AutoHotKey をダウンロードしインストールしておきます。

今回は、AutoHotKey のスクリプトを書いて、IME Toggle の設定を行いました。

## IME Toggle を実現する Script

実際に IME Toggle を実現するためには、以下のようなスクリプトを書きます。

```
; 左 ctrl キーの空打ちで ime の off/on を切り替える
;
; 左 ctrl キーの空打ちで ime  toggle
; ctrl キーを押している間に他のキーを打つと通常の ctrl キーとして動作


#Include IME.ahk

#MaxHotkeysPerInterval 350

*~a::
*~b::
*~c::
*~d::
*~e::
*~f::
*~g::
*~h::
*~i::
*~j::
*~k::
*~l::
*~m::
*~n::
*~o::
*~p::
*~q::
*~r::
*~s::
*~t::
*~u::
*~v::
*~w::
*~x::
*~y::
*~z::
*~1::
*~2::
*~3::
*~4::
*~5::
*~6::
*~7::
*~8::
*~9::
*~0::
*~F1::
*~F2::
*~F3::
*~F4::
*~F5::
*~F6::
*~F7::
*~F8::
*~F9::
*~F10::
*~F11::
*~F12::
*~`::
*~~::
*~!::
*~@::
*~#::
*~$::
*~%::
*~^::
*~&::
*~*::
*~(::
*~)::
*~-::
*~_::
*~=::
*~+::
*~[::
*~{::
*~]::
*~}::
*~\::
*~|::
*~;::
*~'::
*~"::
*~,::
*~<::
*~.::
*~>::
*~/::
*~?::
*~Esc::
*~Tab::
*~Space::
*~Left::
*~Right::
*~Up::
*~Down::
*~Enter::
*~PrintScreen::
*~Delete::
*~Home::
*~End::
*~PgUp::
*~PgDn::
    Return

*~LCtrl::Send {Blind}{vk07}
*~RCtrl::Send {Blind}{vk07}

LCtrl up::
    if (A_PriorHotkey == "*~LCtrl")
    {
        if IME_GetConverting() >= 1 {
            Return
        }

        If IME_GET() = 0
            IME_SET(1)
        ELSE
            IME_SET(0)
    }
Return
```

これらの設定は、fork 元の {{< exlink href="https://github.com/Miraium/ctrl-ime-ahk" text="こちらのリポジトリ" >}} の設定を活用させていただいてます。

LCtrl で Toggle するために書き換えたところだけ説明します。

```
LCtrl up::
    if (A_PriorHotkey == "*~LCtrl")
    {
        if IME_GetConverting() >= 1 {
            Return
        }

        If IME_GET() = 0
            IME_SET(1)
        ELSE
            IME_SET(0)
    }
Return

```

まず、LCtrl up で キーを指定しています。

IME.ahk に実装されている `IME_GET` 関数で現在の IME の状況がわかるので、それが 0 だったら `IME_SET(1)` で、1 だったら `IME_SET(0)` を呼び出して Toggle をしています。

このスクリプトを書き終わったら、スクリプトファイルを `右クリック > Compile Script` で `.exe` ファイルができるので、それを実行すると反映されます。

あとは、この実行ファイルを スタートアップアプリに設定しておくと便利かなと思います。


## まとめ

今回は、AutoHotKey を用いて、IME Toggle を LCtrl の空押しで実現するためにスクリプトを書きました。

いままで、MacOS を使っていたときは、Karabinar-Element などを用いて実現できてたことであれば、この AutoHotKey を用いれば大体のことは実現できそうだなと思いました。
テキストを入力するときに、LCtrl の 空押しで IME 変換することになれていたのでこの設定ができて個人的にはかなりストレスが減りました。

HotKey 周りいじりたい場合は AutoHotKey を用いるのがよさそうです。
