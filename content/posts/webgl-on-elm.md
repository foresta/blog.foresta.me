+++
title = "ElmでWebGLしてみる"
thumbnail = ""
tags = ["elm", "webgl", "advent-calendar"]
categories = ["engineering"]
date = "2018-12-13"
+++

この記事は[Elm2(完全版) Advent Calendar 2018](https://qiita.com/advent-calendar/2018/elm2)の 13 日目の記事です。

## はじめに

Elm が楽しいので、WebGL も動かしてみました。\
今回はサンプルを動かして簡単にソースを見て行きます。

## 環境

-   OSX 10.13.6 (High Sierra)
-   Elm 0.19.0

### WebGL ライブラリについて

現状(2018/12/10)、elm の 0.19.0 では elm-explorations/webgl を用いると良さそうです。
https://package.elm-lang.org/packages/elm-explorations/webgl/latest

ちなみにこいつにたどり着くまでにちょっと苦労しました。

```
どうやらElmにもWebGLのライブラリがあるらしい
↓
Googleで「elm webgl」と検索
↓
検索の一番上に引っかかるのが、elm-community/elm-webgl
↓
deprecated orz
↓
elm-community/webglにリンクが貼られている。
↓
elm-community/webglを見ると使えそうな雰囲気。
↓
githubを見るとdeprecated
↓
elm-explorations/webgl !!
```

## ソースコードを見る

elm-explorations/webgl の sample コードを軽く眺めて見ます。

ソースコードはこちらのを使用します。[examples/cube.elm](https://github.com/elm-explorations/webgl/blob/master/examples/cube.elm)

Main 部分は以下のような感じです。

```elm
main : Program Value Float Float
main =
    Browser.element
        { init = \_ -> ( 0, Cmd.none )
        , view = view
        , subscriptions = (\_ -> onAnimationFrameDelta Basics.identity)
        , update = (\dt theta -> ( theta + dt / 5000, Cmd.none ))
        }
```

通常通り Browser.element を使って表示しています。
ラムダ式で書かれていて型がわかりにくいので、関数化してみる以下のような感じでしょうか？

```elm
type alias Model =
    Float


type Msg
    = Delta Float


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , subscriptions = subscriptions
        , update = update
        }


init : () -> ( Model, Cmd Msg )
init _ =
    ( 0, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Delta dt ->
            ( model + dt / 5000, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions theta =
    onAnimationFrameDelta (\dt -> Delta dt)


view : Model -> Html Msg
view theta =
    WebGL.toHtml
        [ width 400
        , height 400
        , style "display" "block"
        ]
        [ WebGL.entity
            vertexShader
            fragmentShader
            cubeMesh
            (uniforms theta)
        ]
```

Msg も Model も Float だったので型をつけてみました。\
ここらへんは通常の Elm アプリとあんまり変わらない感じですね。\
違うところといえば、subscriptions の onAnimationFrameDelta と view の WebGL.toHtml/entity くらいでしょうか。

[onAnimationFrameDelta](https://package.elm-lang.org/packages/elm/browser/latest/Browser-Events#onAnimationFrameDelta) は 毎フレーム呼ばれ前フレームとの差分の delta ミリ秒を取得できるものです。アニメーションなどをステップ実行する際に便利なやつですね。

[WebGL.toHtml](https://package.elm-lang.org/packages/elm-explorations/webgl/latest/WebGL#toHtml)で Html msg を生成しています。

width, height で WebGL を描画する Canvas の描画サイズを指定しています。\
[WebGL.entity](https://package.elm-lang.org/packages/elm-explorations/webgl/latest/WebGL#entity) は以下のような定義になっています。

```
entity :
    Shader attributes uniforms varyings
    -> Shader {} uniforms varyings
    -> Mesh attributes
    -> uniforms
    -> Entity
```

WebGL.entity には、VertexShader, FragmentShader、メッシュ情報、Uniform を渡しています。

具体的な GLSL についての説明は省略しますが、以下のサイトは非常に参考になるのでオススメです。\
https://wgld.org/

実際に動かして見ると以下のような感じです。

{{< tweet user="kz_morita" id="1065384685646209025" >}}

## おわりに

WebGL を Elm での扱い方を簡単に紹介しましたが、意外と手軽にできるのと、あとは型があるので、その通りに実装すればある程度動くものが作れるというのは Elm で WebGL を使う大きなメリットかなと思います。

これを用いて色々と作って見たら面白そうだなと思いました。
