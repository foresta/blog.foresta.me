+++
title="Passport を使ってソーシャルログイン機能を実装する"
date="2020-08-23T22:33:12+09:00"
categories = ["engineering"]
tags = ["passport", "express", "express-session", "session-memory-store", "node"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，Node.js で，Passport というライブラリを使って，ソーシャルログイン機能を実装したので簡単に方法をまとめます．

https://www.npmjs.com/package/passport

## 基本的な使い方

今回使用するライブラリは，`express`, `express-session`, `passport`, `passport-twitter`, `passport-facebook`, `session-memory-store` です．
また，TypeScript を用いるため環境などについては事前にインストールを行い，構築済みなものとします．

まずは，サーバーの main 処理となる `server/index.ts` です．

##### src/server/index.ts
```js
import express from 'express';
import session from 'express-session';

import passport from './auth/passport';
import authRouter from './router/auth';

const app = express();

app.use(
  session({
    secret: 'super-secret-key',
    saveUninitialized: false,
    rolling: true,
    resave: false,
    cookie: {
      secure: 'auto',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
)

app.use(passport.initialize());
app.use('/auth', authRouter);

app.listen(3000, () => console.info('Server started http://localhost:3000'));
```

次に認証周りのルーティングの処理です．Twitter の例だけ載せますが，Facebookログインなども同様に書くことができます．

##### src/server/router/auth.js

```js
import express, { Response } from 'express';
import passport from '../../auth/passport';

const router = express.Router();

router.get('/twitter/signin', (req, res, next) => {
  // query parameter で渡したURLへリダイレクトするように実装
  const redirectTo = req.query.to || '/';
  req.session.redirectTo = redirectTo;

  // Session
  passport.authenticate('twitter', {
    session: false,
  })(req, res, next);
});
router.get('/twitter/callback', (req, res, next) => {
  const callback = () => {
    const redirectTo = req.session.redirectTo;
    delete req.session.redirectTo;
    if (req.user.isSuccess) {
      // 成功の場合は，リダイレクト
      const to = redirectTo || '/';
      res.redirect(to);
    } else {
      // 失敗した場合はエラー情報を session につめて元いたページへリダイレクト
      res.session.authError = req.user.err;
      res.status(req.user.error.status).redirect('back');
    }
  };
  passport.authenticate('twitter', {
    session: false,
  })(req, res, callback);
});


router.get('/facebook/signin', (req, res, next) => {
	// ...
});
router.get('/facebook/callback', (req, res, next) => {
	// ...
});

export default router;
```

次に，実際に passport を使ってソーシャル連携するところの実装を書いていきます．
前提として，Twitter や Facebook などの Consumer Keyなどは，各種 Developer サイトから取得し，.env ファイルに記載しているものとします．（ `process.env.HOGE` で読み出せる状態 ）
また，CallbackURL も 各種 Developer サイトに登録されていることを確認してください．

##### src/server/auth/passport.js

```js
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as FacebookStrategy } from 'passport-facebook';

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY ?? '',
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET ?? '',
      callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
      passReqToCallback: true,
    },
    async (req, token, tokenSecret, profile, done) => {
      // Twitter の Token と Secret が取得できるので，これらのデータを新規登録時にユーザーデータと紐付けておき，
      // そのデータを照合することでユーザーデータを取得する

      const user = await api.fetchUser(token, accessToken); // ユーザーを取得する処理

      // 成功時
      if (user) {
      	return done(null, { isSuccess: true, user });
      } else {
        return done(null, { isSuccess: false, err });
        // または
        // return done(null, false); // 第二引数にfalse を渡すと認証失敗を意味する
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
      callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
		// ユーザーを取得する処理
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, data);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
```

このようにすることで，実際に Twitter などを用いた認証のフローを実装することができます．非常に便利ですね．

## session-memory-store を用いた Session 管理

ソーシャル連携を行う passport-twitter や，passport-facebook では，ページをリダイレクトしつつも token の情報などを引き継がないと行けないため，session が必須になります．

session の保持に用いられるストアは，デフォルトではメモリのものになりますが，こちらメモリリークなどがあり，本番環境では使わないことが推奨されています．

```js
app.use(
  session({
    secret: 'super-secret-key',
    saveUninitialized: false,
    rolling: true,
    resave: false,
    cookie: {
      secure: 'auto',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }, // store: を指定しないとデフォルトのメモリストアになる
  })
)
```

詳しくはこちら．
- https://stackoverflow.com/questions/10760620/using-memorystore-in-production

なので，通常は Redis や MySQL などの外部ミドルウェアを使うことになるのですが，シンプルなサイトなどの場合 Redis を立てるまででもないようなケースはあると思います．
上記の StackOverflow にも書かれていますが，そんなときに，{{< exlink href="https://www.npmjs.com/package/session-memory-store" text="session-memory-store" >}} が利用できます．

```js
import express from 'express';
import session from 'express-session';

import MemoryStoreFactory from 'session-memory-store';
const MemoryStore = MemoryStoreFactory(session);

const app = express();
/// ...

app.use(
  session({
    secret: 'super-secret-key',
    saveUninitialized: false,
    rolling: true,
    resave: false,
    cookie: {
      secure: 'auto',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: new MemoryStore({}), // ここを追加
  })
)
```

こちら Production ように使うために設計された MemoryStore ということなので，外部ミドルウェアの代わりにこちらの仕様を検討するのも良さそうな気がしています．

## まとめ

今回は，Node.js でソーシャル連携を用いた認証を行うために，Passport をつかって簡単に実装してみました．
Node.js はちゃんと触ったことがなく，かなり手探りでしたがそれでもライブラリ群が充実していて，さくっと実装できるのは素晴らしいと思いました．

