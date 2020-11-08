+++
title="React + TypeScript + emotion の環境に Storybook を導入する"
date="2020-11-08T23:22:51+09:00"
categories = ["engineering"]
tags = ["react", "typescript", "storybook", "emotion", "create-react-app"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，React + TypeScript + emotion で作成している環境に対して Storybook を導入しようとして手こずった点があったのでその点について簡単にまとめます．

## 環境について

今回の環境は以下の通りです．

```
- React: 17.0.1
- TypeScript: 4.0.3
- @emotion/core: 10.1.1
- @emotion/styled: 10.0.27
```


また，emotion の `css` props を `/** @jsx jsx */` という JSX Pragma を書かずに使用するために，`@emotion/babel-preset-css-prop` を導入しています．

webpack は，できるだけ編集したくないため，{{< exlink href="https://www.npmjs.com/package/react-app-rewired" text="react-app-rewired" >}} と {{< exlink href="https://www.npmjs.com/package/customize-cra" text="customize-cra" >}} を用いて以下のようにカスタマイズをしています．


##### package.json
```
  "scripts": {
    "start": "HTTPS=true react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject",
  },
```

##### config-overrides.js
```
const { override, addBabelPreset } = require('customize-cra');

module.exports = override(addBabelPreset('@emotion/babel-preset-css-prop'));
```


詳しくはこちらを参照してみてください

- https://medium.com/@harryhedger/quick-how-to-use-the-emotion-css-prop-with-create-react-app-5f6aa0f0c5c5
- https://qiita.com/Statham/items/8cbf6d5057ccb6d8feb8

## 起こった問題について

上記の環境で実際に React で動かした際には，`css` props が使えていたのですが，storybook 上で component を表示してみると，うまく Style が当たって表示されずに，Object をパースしようとしてしまっていました．

これは，babel-preset-css-prop が storybook 側に反映出来ていないようでした．


## 解決策

以下のような webpack.config を `.storybook` の下に追加することで解決しました．

##### .storybook/webpack.config.js
```
const path = require('path');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [
        ['react-app', { flow: false, typescript: true }],
        // css prop を使えるように，追加
        require.resolve('@emotion/babel-preset-css-prop'),
      ],
    },
  });

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
```

参考: {{< exlink href="https://github.com/emotion-js/emotion/issues/1306" >}}


## まとめ

create-react-app を使用していると，`webpack.config.js` のメンテナンスから開放されてかなり体験がよいなぁと感じたのと，さらにカスタマイズしたい人向けに，`customize-cra` のような library まで用意されていたのは，さすがにフロントエンドの開発はスピードが早いとはいえ，成熟しているなと思いました．

上記の emotion + storybook を使う際に手こずりましたが，Github などに Issue などが多くあり，それらを読めばある程度は解決できそうだったのには，驚きました．

フロントエンド開発はながいこと離れていて，久しぶりにまじめに触ってみましたが便利なものが多くて良い意味で驚かされることが多く感じます．
一方でベストプラクティスがなんなのか探り続ける必要もありそうに感じたので，そこはバランスをとりながら開発を進めていければなと思います．
