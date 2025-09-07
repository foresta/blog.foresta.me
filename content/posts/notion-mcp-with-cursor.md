+++
title="Cursor から Notion MCP を利用する"
date="2025-09-08T00:10:11+09:00"
categories = ["engineerign"]
tags = ["cursor", "mcp", "notion"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Cursor から Notion MCP を利用してみたところ便利だったので紹介します。

なおこの記事は Notion 公式の MCP サーバーではなく、ローカルで MCP サーバーを立てて利用する方法を紹介します。

## Notion 上で Integration の設定

Notion 上で API が利用できるように Integration の設定を行います。

こちらは、Notion API を使う手順と同様なため以下の記事などを参照してみてください。

- {{< exlink href="https://developers.notion.com/docs/create-a-notion-integration" text="Create a Notion integration" >}}
- {{< exlink href="https://zenn.dev/kou_pg_0131/articles/notion-api-usage" text="Notion API を使用してデータベースを操作する" >}}


## mcp.json の設定

Cursor 上で MCP の設定画面を開くと mcp.json が編集できます。

```json
{
  "mcpServers": {
    "Notion": {
      "command": "npx",
      "args": [
        "-y",
        "@notionhq/notion-mcp-server"
      ],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\":\"Bearer ntn_XXXXXX\",\"Notion-Version\":\"2022-06-28\"}"
      }
    }
  }
}
```


ntn_XXXXXX の部分は Notion 上で作成した Integration の Internal Integration Token を設定してください。

こちらで MCP サーバーの設定は完了です。

## さいごに

私は、Notion から Linear というタスク管理ツールにタスクを移植したのですが、その作業に Cursor + Notion MCP を利用しました。
かなり便利でしたのでこういう地道作業は全部AIにやらせていこうと思います。
