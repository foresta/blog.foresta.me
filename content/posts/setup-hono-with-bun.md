+++
title="Hono と Bun を用いたフロントエンド環境を構築してみる"
date="2024-03-02T09:40:48+09:00"
categories = ["engineering"]
tags = ["hono", "bun", "react"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Hono と Bun 気になっていたフロントエンドの技術ですが、ちょっとしたツールを作る際に画面側も用意したいとなったので、つかってみた際のメモです。

- {{< exlink href="https://hono.dev/" >}}
- {{< exlink href="https://bun.sh/" >}}

結論から言うと、上記の公式サイトの Setup と、React を導入する際に以下の記事を参照したらサクッと構築できました。

- {{< exlink href="https://zenn.dev/yusukebe/articles/06d9cc1714bfb7" text="HonoでAPI付き雑React SPA最小" >}}

## Install

まずは、Bun のインストールから実施します。

```bash
# Install Bun
$ curl -fsSL https://bun.sh/install | bash
```

.profile (各個人の環境に合わせたもの。.bashrc とかでもOK ) に以下追加

```
$ export PATH="$PATH:$HOME/.bun/bin"
```

反映

```bash
$ source ~/.profile
```

パスが通ったら確認します。

```bash
$ bun --version
1.0.29

$ bunx
Usage: bunx [...flags] <package>[@version] [...flags and arguments]
Execute an npm package executable (CLI), automatically installing into a global shared cache if not installed in node_modules.

Flags:
  --bun      Force the command to run with Bun instead of Node.js

Examples:
  bunx prisma migrate
  bunx prettier foo.js
  bunx --bun vite dev foo.js
```

これで Bun のインストールは完了です。

## Project Setup & Deploy

次に hono のドキュメントを参考に構築します。

- {{< exlink href="https://hono.dev/getting-started/basic" >}}
- {{< exlink href="https://hono.dev/getting-started/cloudflare-pages" >}}

先ほどいれた、`bunx` コマンドを利用して `create-hono` します。


```bash
$ bunx create-hono
```

上記を実行すると以下のような入力が求められるので↓のように入力しました。

- Target directory => hono-sample
- Which template do you want to use => cloudflare-pages
- Do you want to install project dependencies => yes
- Which pakcage manager do you want to user > bun

template は以下から選べるみたいです。

```
aws-lambda
bun
cloudwlare-pages
cloudwlare-workers
deno
fastly
lamnda-edge
netlify
nextjs
nodejs
vercel
x-basic
```

この以下を実行してみます。

```bash
$ bun run dev
```

すると以下きかれるので、適当に答えます。
```
Would you like to help improve Wrangler by sending usage metrics to Cloudflare? [Y/n]
```

これらが終わると、localhost で 立ち上がることを確認できました。


package.json みると以下のような感じになってました。

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite buildvite build",
    "preview": "wrangler pages dev dist",
    "deploy": "$npm_execpath run build && wrangler pages deploy dist"
  },
  "dependencies": {
    "hono": "^4.0.8"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240208.0",
    "@hono/vite-cloudflare-pages": "^0.2.4",
    "@hono/vite-dev-server": "^0.8.1",
    "vite": "^5.0.12",
    "wrangler": "^3.25.0"
  }
}
```

local の build には、{{< exlink href="https://ja.vitejs.dev/" text="Vite" >}} が使われており、Cloudfrare の CLI ツールとして、{{< exlink href="https://developers.cloudflare.com/workers/wrangler/" text="Wrangler" >}} がインストールされていることがわかります。

deploy コマンドもありそうなので実行してみます。

```bash
$ bun run deploy
```

Cloudflare のアカウントとか持ってなかったのですが、このタイミングで Login ページがブラウザで開きました。
Signup を実行すると、Wrangler にアクセス許可を求めるページが開かれたので、許可すると deploy が始まります。

エラーがでましたが、Cloudflare のアカウントが verify できてなかったみたいなのでメールアドレスに届いたリンクを踏んでもう一回 deploy コマンド叩きました。

するとデプロイが完了し、実際にページにアクセスすることができました。とても便利！

## React を Hono で使う

デフォルトでは hono の jsx を返すようになっているようですが、React を使うようにもできます。

{{< exlink href="https://zenn.dev/yusukebe/articles/06d9cc1714bfb7" text="こちらの記事">}} に詳細に書かれているのでその通りにSetup してみます。

ますは React 周りの library を Install します。

```
$ bun add react react-dom
$ bun add -D @types/react @types/react-dom
```

次に、build まわりの以下ファイルを修正していきます。

- tsconfig.json
- vite.config.ts
- package.json

基本的には、以下のリポジトリの通りにセットアップすれば大丈夫でした。

- {{< exlink href="https://github.com/yusukebe/hono-spa-react" >}}

下記は、build 周りのメモになります。

---

まずは、tsconfig.json について。

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "lib": [
      "ESNext",
      "DOM",
      "DOM.Iterable"
    ],
    "types": [
      "@cloudflare/workers-types",
      "vite/client"
    ],
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
}
```

tsconfig.json `lib` に `DOM` と `DOM.Iterable` を追加します。これがないと、client 側の tsx ファイルで、`document.getElementById` などが実行できないです。(設定忘れててつまりました)

あとは、`jsxImportSourct` が、`hono/jsx` になっていたところを、`"react"` に変更します。

次に vite.config.ts です。

こちらは client 側のビルド設定と Server 側で分けて設定をします。

Server 側の設定の `ssr.extrernal` に `react` と `react-dom` を追加しています。

```tsx
import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'


export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/client.tsx',
          output: {
            entryFileNames: 'static/client.js'
          }
        }
      }
    }
  } else {
    return {
      ssr: {
        external: ['react', 'react-dom']
      },
      plugins: [
        pages(),
        devServer({
          entry: 'src/index.tsx'
        })
      ]
    }
  }
})
```

package.json では、上記で行なった `vite.config.ts` の設定を利用して、ビルドするような設定をします。

scripts の部分だけ抜粋します。

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build --mode client && vite build",
    "preview": "wrangler pages dev dist",
    "deploy": "$npm_execpath run build && wrangler pages deploy dist"
  }
}
```

build コマンドで、まず、`--mode client` で build した後に、通常の build を行なっています。
これはおそらく、client 側の js を先にビルドしないと、Module を 読み込む時にエラーになるためだと思います。

実際にサーバー側で初回レンダリング時に返す html の jsx は以下のようになっています。

```jsx
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="/static/style.css" rel="stylesheet" />
        {import.meta.env.PROD ? (
          <script type="module" src="/static/client.js"></script>
        ) : (
          <script type="module" src="/src/client.tsx"></script>
        )} 
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
```

ローカルでは、`src` ディレクトリ以下の、`client.tsx` をみて、デプロイするさいには、`static` ディレクトリにビルドされた `client.js` をみるような設定になっていることがわかります。

## まとめ

今回は、Hono と Bun を使って、フロントエンドの開発環境を構築してみることをしました。
コマンド一発で、Cloudflare Pages にデプロイまでできてかなり便利だなと思います。久しぶりにフロント側の技術に触れてみましたがデプロイまでのリードタイムがかなり短く、エコシステムの充実されている感じがとても良い開発者体験だと思います。

また、React の導入も比較的簡単にでき便利でした。
色々と画面を作ってみようと思います。
