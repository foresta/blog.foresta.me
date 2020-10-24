+++
title="react-facebook-login の モバイルWeb 対応について"
date="2020-10-24T13:21:39+09:00"
categories = ["engineering"]
tags = ["react", "react-facebook-login", "nodejs", "express", "passport-facebook"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，React で Webサービスを構築している際に，Facebook ログインを実装しようとしてちょっと躓いたことをまとめます．

## 環境と対象のコード

今回のシステムが，Web-Server と API-Server が別れており，Web-Server では主に，ページのレンダリングやリダイレクト周りの処理を行い，提供するコンテンツに関しては，API-Server から取得するといった構成になっていました．

{{< mermaid >}}
graph LR;
    Browser-->WebServer;
    WebServer-->APIServer;
    Browser -->APIServer;
{{< /mermaid >}}

facebook login には，{{< exlink href="https://www.npmjs.com/package/react-facebook-login" text="react-facebook-login" >}} を利用していました．


```react

import React from 'react';

// 独自のデザインのFacebookLogin ボタンを用意するため，こちらを import
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

export const LoginPage: React.FC = () => {

  const handleAuthWithFacebook = React.useCallback(
    (response: FacebookAuthResponse): void => {
      if (response == null || response.accessToken == null) return;
      
      // Facebook の accessToken つかって，signin する処理
      signinWithFacebook(response.accessToken, redirecdtTo);
    },
    [redirectTo]
  );

  return (
    <FacebookLogin
      appId={process.env.FACEBOOK_APP_ID ?? ''}
      callback={onAuthWithFacebook}
      redirectUri={URL.LOGIN_PAGE}
      render={(renderProps: any): React.ReactNode => (
        <button onClick={renderProps.onClick}>Facebook でログイン</Button>
      )}
    />
  );
}

```

## 起こったこと

発生した困ったことを時系列でまとめてみます．

### モバイル Web で Facebook ログインができない

上記に書いたコードで試したところ，モバイルのときに `handleAuthWithFacebook` が呼ばれずに，何も起きないような現象になりました．

`react-facebook-login` のコードを見たところ，isMobile かどうかで，処理を分岐しているようでした．

https://github.com/keppelen/react-facebook-login/blob/master/src/facebook.js#L192

```react
    if (this.props.isMobile && !disableMobileRedirect) {
      window.location.href = `https://www.facebook.com/dialog/oauth${getParamsFromObject(params)}`;
    } else {
      if (!window.FB) {
        if (this.props.onFailure) {
          this.props.onFailure({ status: 'facebookNotLoaded' });
        }

        return;
      }

      window.FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          this.checkLoginState(response);
        } else {
          window.FB.login(this.checkLoginState, { scope, return_scopes: returnScopes, auth_type: params.auth_type });
        }
      });
    }
```

`isMobile = true` のときは，`https://www.facebook.com/dialog/oauth` へと遷移し，パラメータの redirectUri に戻ってくるといった具合でした．

そのため，`handleAuthWithFacebook` が呼ばれずに，何も起こっていませんでした．

そこで上記の，`disableMobileRedirect` props を true にする対応を行ったところ，iPhone, Android でもログイン処理を行うことが出来ました．

```react
  <FacebookLogin
    appId={process.env.FACEBOOK_APP_ID ?? ''}
    callback={onAuthWithFacebook}
    redirectUri={URL.LOGIN_PAGE}
    disableMobileRedirect={true}
    render={(renderProps: any): React.ReactNode => (
      <button onClick={renderProps.onClick}>Facebook でログイン</Button>
    )}
  />
```

### Android , iOS の WebView で開くと Facebook ログインができない

今回作成していたサービスの仕様上，ほかアプリから WebView で開かれることも想定されるものだったので，WebView で開けないのは修正が必要です．

原因としては，`disableMobileRedirect` を true にしたことで，PC 版と同じ JavaScript の Facebook SDK を用いた Dialog を開いて認証する方式になっていたのですが，どうやらその方式と WebView の相性が悪かったらしくうまく動作していませんでした．

解決策として，Mobile の場合は，JavaScript の SDK を用いずに，自前で Facebook のログインフローを構築しました．
WebServer は，Node.js (Express) で動いていたので，{{< exlink href="http://www.passportjs.org/docs/facebook/" text="passport-facebook" >}} を用いてログインフローを行いました．

```react
{isMobile || isTablet ? (
  <a href="/auth/facebook/signin">Facebok ログイン</a>
) : (
  <FacebookLogin
    appId={process.env.FACEBOOK_APP_ID ?? ''}
    callback={onAuthWithFacebook}
    isMobile={false}
    render={(renderProps: any): React.ReactNode => (
      <button onClick={renderProps.onClick}>Facebook でログイン</Button>
    )}
  />
)}
```

ここでは，`/auth/facebook/signin` が Express で要している Facebook 用のエンドポイントになります．

## まとめ

今回は，Facebook ログインを実装するときに躓いたところをまとめました．

モバイルや WebView での動作がうまく行かないケースは結構ありそうなので，要確認だと再認識しました．
また，困ったときには ソースコードをちゃんと読みに行くのが大事だなぁと痛感しました．
