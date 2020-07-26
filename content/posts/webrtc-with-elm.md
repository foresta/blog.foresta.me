+++
title="ElmでWebRTCをやってみる"
date="2020-07-26T23:09:44+09:00"
categories = ["engineering"]
tags = ["elm", "webrtc"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

現在，Elm で WebRTC をやろうとしていて，途中まで実装をしたのでその内容を書いていきます．

## WebRTC とは

WebRTCは，ブラウザ同士でリアルタイムコミュニケーションを実現するための仕組みで，P2Pでビデオやデータなどをやり取りするための技術です．P2Pのコネクションをはる仕組みやビデオのコーデックなど難しいところをうまく隠蔽して，簡単にブラウザから使える仕組みになっています．

## Elm でローカルのビデオを取得する

HTMLは以下のような感じです．

```html
<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>WebRTC Sample</title>
<script src="main.js"></script>
</head>
<body>
  <script>
    const app = Elm.Main.init();

    app.ports.readyForLocalStream.subscribe(async (videoTagId) => {
      const videoTag = document.getElementById(videoTagId);

      const audioConfig = true;
      const videoConfig = { width: 1280, height: 720 };

      let localStream = null;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ 
          audio: audioConfig,
          video: videoConfig,
        });
      } catch(err) {
        alert(err);
      }

      videoTag.srcObject = localStream;
      videoTag.onloadedmetadata = (e) => {
        videoTag.play();
      }
    });
  </script>
```

Elm のファイルは以下のような感じ

```elm
port module Main exposing (Model, Msg(..), init, main, readyForLocalStream, subscriptions, update, view)

import Browser
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Set exposing (Set)
import Url



-- WebRTC ports


port readyForLocalStream : String -> Cmd msg



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }



-- MODEL


type alias Model =
    { key : Nav.Key
    , url : Url.Url
    }


init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key =
    ( { key = key
      , url = url
      }
    , readyForLocalStream "localVideo"
    )



-- UPDATE


type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Nav.pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, Nav.load href )

        UrlChanged url ->
            ( { model | url = url }
            , Cmd.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "WebRTC サンプル"
    , body =
        [ Html.h1 [] [ text "WebRTC サンプル" ]
        , Html.video [ Html.Attributes.id "localVideo" ] []
        ]
    }
```


WebRTC周りの実装は，Elm から ports で JavaScript 側に委譲しています．

下記のコードのように， `navigator.mediaDevices.getuserMedia` を実行すると，ブラウザからビデオと音声に許可を与えるダイアログが表示されます．

```javascript
const audioConfig = true;
const videoConfig = { width: 1280, height: 720 };

let localStream = null;
try {
  localStream = await navigator.mediaDevices.getUserMedia({ 
    audio: audioConfig,
    video: videoConfig,
  });
} catch (err) {
  // handle error
}
```

取得した `MediaStream` を videoタグの `srcObject` にいれ，`onloadedmetadata` のハンドラ内で，videoTag.play() を実行します．

```javascript
videoTag.srcObject = localStream;
videoTag.onloadedmetadata = (e) => {
  videoTag.play();
}
```

このようにすると，ローカルのビデオを取得して，再生することができます．


## まとめ

今回はデバイスのカメラの映像を取得して再生するところまでを実装しました．Elmとの連携も，port を用いれば問題なく行けそうなことがわかりました．
次は，シグナリングサーバーを実装していきます．（多分 Rust で書く予定です）
