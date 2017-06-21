+++
date = "2017-06-17T10:43:38+09:00"
title = "phoenix_guide"

+++

# Phoenixの公式のGuideを読んだ時のメモ

[Phoenix guide](http://www.phoenixframework.org/docs/overview)

## create project
`mix phoenix.new /path/to/project/directory/`
`mix phoenix.new --no-brunch /path/to/project/directory/`

serve
`mix phoenix.sever`
`iex -S mix phoenix.server`

database
`mix ecto.create`

## Routes
[http://www.phoenixframework.org/docs/routing]

```
`(get|post|put|delete) "/", PageController`
GET "/" => PageController  :index

`resources "users", UserController`
GET     "/users"            :index
GET     "/users/:id/edit"   :edit
GET     "/users/new"        :new
GET     "/users/:id"        :show
POST    "/users"            :create
PATCH   "/users/:id"        :update
PUT     "/users/:id"        :update
DELETE  "/uusers/:id"       :delete

`resources "/users" UserController :only [:index, :show]`
GET     "/users"            :index
GET     "/users/:id"        :show

`resources "/users" UserController :except [:delete]`
GET     "/users"            :index
GET     "/users/:id/edit"   :edit
GET     "/users/new"        :new
GET     "/users/:id"        :show
POST    "/users"            :create
PATCH   "/users/:id"        :update
PUT     "/users/:id"        :update
```

### Path Helper

```
iex> PhoenixSample.Router.Helpers.page_path(PhoenixSample.Endpoint, :index)
"/"
```

Ex:
`<a href="<%= page_path(@conn, :index) %>">To the Welcome Page!</a>`

```
iex> import HelloPhoenix.Router.Helpers
iex> alias HelloPhoenix.Endpoint
iex> user_path(Endpoint, :index)
"/users"
iex> user_path(Endpoint, :show, 17)
"/users/17"
iex> user_path(Endpoint, :new)
"/users/new"
iex> user_path(Endpoint, :create)
"/users"
iex> user_path(Endpoint, :edit, 37)
"/users/37/edit"
iex> user_path(Endpoint, :update, 37)
"/users/37"
iex> user_path(Endpoint, :delete, 17)
"/users/17"
iex> user_path(Endpoint, :show, 17, admin: true, active: false)
"/users/17?admin=true&active=false"
path => urlでfullpath
iex(3)> user_url(Endpoint, :index)
"http://localhost:4000/users"
```

### scoped

```
scope "/admin", HelloPhoenix.Admin, as: :admin do
  pipe_through :browser

  resources "/images",  ImageController
  resources "/reviews", ReviewController
  resources "/users",   UserController
end
```


### Plug stack

pipe_through :browser
      phoenixはデフォルトで:apiと:browserのパイプラインを作成している

### Endpoint Plugsについて

順番

* Pulg.Static
* Plug.Logger
* Phoenix.CodeReloader
* Plug.Parser
* Plug.MethodOverride
* Plug.Head
* Plug.Session
* Plug.Router


### :browser and :api

#### :browser pipeline
```ex
plug :accepts, ["html"]    # request format
plug :fetch_session                 # fetch session data
plug :fetch_flash                     # regrieves any flash messages
plug :protect_from_forgery               # protect from posts from crosssite forgery
plug :put_secure_browser_headers # ---
```

#### :api pipeline

```ex
plug :accepts, ["json"]
```

#### custom new pipeline

```ex

pipeline :new_pipeline  do
  plug : ~~~
  plug : ~~~
end

scope */new_pipeline_scope*, HogePhoenix do
  pipe_through :new_pipeline

  resources "/". ReviewController
end
```
## Channel Routes

endpoint.ex

```ex
defmodule HelloPhoenix.Endpoint do
  use Phoenix.Endpoint

  socket "/socket", HelloPhoenix.UserSocket
  socket "/admin-socket", HelloPhoenix.AdminSocket
end
```



web/channel/user_socket.ex
```ex
defmodule HelloPhoenix.UserSocket do
  use Phoenix,Socket

  channel "rooms:*", HelloPhoenix.RoomChannel
end
```

channel/3

1st arg
"topic:subtopick"の形
```
"rooms:*", "rooms:kitchen", "rooms:lobby"
```

2nd arg
Module like a HelloPhoenix.RoomChannel

3rd arg
via
PhoenixはlongPollingとWebSocketを抽象化したSocketで表現している
片方を指定したい場合にOptionalとしてviaを使用する

```
channel "rooms:*", HelloPhoenix.RoomChannel, via: [Phoenix.Transports.WebSocket]
channel "foods:*", HelloPhoenix.FoodChannel
```

### Routingまとめ
* HTTPメソッド(GET/POST/PUT/DELETE/etc...)から始まるのマッチするメソッドに展開
* resourcesから始まるものを 8つのマッチするメソッドに展開
    index, edit, new, show, create, update(PATCH), update(PUT), delte
* resourcesはonly: except:で制限できる
* ネストできる
* スコープがパスになる
* as: を使うと記述の重複を防げる
* スコープありのルーティングにhelperオプションを使うと、到達できないパスが削除される


## Plug
Webアプリケーション間のモジュールをつなぐ仕様で、他のwebサーバとのコネクションのアダプタとしての抽象レイヤーでもある。
Connectionの概念を統一するためのアイデア

他のHTTP middlewareとの違い（特徴）
requestとresponseがmiddlewere stackから分離されている

Functionとして,Moduleとしての側面がある

### Function Plug

%Plug.Conn{}構造体と、optionのオプションを受け取って%Plug.Conn{}を返す必要がある
Optionを使って、Plug.Connを変換するためのもの

example
```ex
def put_headers(conn, key_values) do
  Enum.reduce key_values, conn, fn {k, v}, conn ->
    Plug.Conn.put_resp_header(conn, to_string(k), v)
  end
end
```

put_header/2, put_layout/2, action/2

このPlugを使った書き換えすごい

改良前
```ex
defmodule HelloPhoenix.MessageController do
  use HelloPhoenix.Web, :controller

  def show(conn, params) do
    case authenticate(conn) do
      {:ok, user} ->
        case find_message(params["id"]) do
          nil ->
              conn |> put_flash(:info, "メッセージないよ") |> redirect(to: "/")
          message ->
            case authorize_message(conn, params["id"]) do
              :ok ->
                render conn, :show, page: find_message(params["id"])
              error ->
                conn |> put_flash(:info, "You can't access that page") |> redirect(to: "/")
            end
        end
      :error ->
        conn |> put_flash(:info, "You must be logged in") |> redirect(to: "/")
    end
  end
end
```

改良後

```
defmodule HelloPhoenix.MessageController do
  use HelloPhoenix.Web, :controller

  plug :authenticate
  plug :find_message
  plug :authorize_message

  def show(conn, params) do
    render conn, :show, page: find_message(params["id"])
  end

  defp authenticate(conn), do: ...
  defp authenticate(conn, _) do
    case Authenticator.find_user(conn) do
      {:ok, user} ->
         assign(conn, :user, user)
      :error ->
         conn |> put_flash(:info, "ログインしてね") |> redirect(to: "/") |> halt
    end
  end

  defp find_message(id), do: ...
  defp find_message(conn, _) do
    case find_message(conn.params["id"]) do
      nil ->
        conn |> put_flash(:info, "That message wasn't found") |> redirect(to: "/") |> halt
      message ->
        assign(conn, :message, message)
    end
  end

  defp authorize_message(conn, _) do
    if Authorizer.can_access?(conn.assigns[:user], conn.assigns[:message]) do
      conn
    else
      conn |> put_flash(:info, "You can't access that page") |> redirect(to: "/") |> halt
    end
  end
end
```

## Module Plugs
Connectionを変換するものとは別。

以下を定義する

* init/1

```
arg: default
```
* call/2
```    
    arg1: conn
    arg2: default
```

```
defmodule HelloPhoenix.Plugs.Locale do
  import Plug.Conn

  @locales ["en", "fr", "de"]

  def init(default), do: default

  def call(%Plug.Conn{params: %{"locale" => loc}} = conn, _default) when loc in @locales do
    assign(conn, :locale, loc)
  end
  
  def call(conn, default), do: assign(conn, :locale, default)
end

defmodule HelloPhoenix.Router do
  use HelloPhoenix.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug HelloPhoenix.Plugs.Locale, "en"
  end
  ...
end
```
