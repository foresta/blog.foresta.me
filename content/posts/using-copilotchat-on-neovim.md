+++
title="neovim で CopilotChat を使う"
date="2024-12-01T13:13:43+09:00"
categories = ["engineering"]
tags = ["neovim", "copilotchat", "llm"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

普段 neovim をメインのエディタとして使っていますが、CopilotChat も neovim で使用できたので設定方法を紹介します。

この記事の前提として、Copilot は導入済みなものとします。

まだ導入されてない方は、以前書いた[こちらの記事](/posts/neovim-copilot/)を参考にしてみてください。


## CopilotChat の設定

CopilotChat は neovim でもサポートされており、以下の公式の手順を参考に設定ができます。

- {{< exlink href="https://github.com/CopilotC-Nvim/CopilotChat.nvim" text="CopilotChat.nvim" >}}

ただし、自分の環境ではプラグインマネージャに Dein を使っていたりなど若干差分があったので補足します。

私の環境では dein を 使用しているので、dein.toml に以下のように追記してプラグインをインストールできるようにします。

```toml
[[plugins]]
repo = 'github/copilot.vim'

[[plugins]]
repo = 'nvim-lua/plenary.nvim'

[[plugins]] # CopilotChat
repo = 'CopilotC-Nvim/CopilotChat.nvim'
depends = ['github/copilot.vim', 'nvim-lua/plenary.nvim']
branch = 'canary'
```

つぎに、CopilotChat のセットアップ用のスクリプトを lua で記載します。

私の環境では `~/.config/nvim/lua/copilot_chat_config.lua` というファイルを作成し以下の内容を記載しました。

```lua
require("CopilotChat").setup {
  debug = true, -- Enable debugging
}
```

そして、`init.vim` に以下のように記載します。

```vim
lua require('copilot_chat_config')
```

ここまで設定を行った後に、neovim を再度起動すると CopilotChat が有効になります。

使用する際は、`:CopilotChat` で CopilotChat を起動できます。


起動したら、以下のように Chat 画面が表示されます。
Insert Mode で入力をした後、Normal Mode で Enter を押すと Copilot が起動します。

{{< figure src="/images/posts/using-copilotchat-on-neovim/copilotchat.png" alt="CopilotChat" >}}

上記は、ファイルを開いた状態で CopilotChat を起動し、「要約してください」と入力した結果です。(このブログ記事のmarkdown ファイルを開いていたので、その内容が要約されています)


今回は文字で打ちましたが、もともと `/Explain` などといったコマンドも用意されているのでそちらも活用できます。

用意されているコマンドなどは、{{< exlink href="https://github.com/CopilotC-Nvim/CopilotChat.nvim?tab=readme-ov-file#prompts" text="こちらの公式ドキュメント" >}}を参考にしてください。

## まとめ

今回は、neovim で CopilotChat を使う方法を紹介しました。
CopilotChat 自体の導入は非常に簡単ですぐに使い始められるのが魅力的です。neovim 用のプラグインなど公式で用意してもらえるのは非常にありがたいので、積極的に使っていきたいと思います。
