+++
title="Axum のお試しとエラーハンドリング"
date="2023-11-05T18:50:03+09:00"
categories = ["engineering"]
tags = ["rust", "axum"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今日は、Rust の Web フレームワークの、Axum を使ってみたのメモです。

## Axum を使ってみる

- {{< exlink href="https://github.com/tokio-rs/axum" >}}

基本形は以下のような形です。

```rust
use axum::routing::get;
use axum::Router;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(index));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn index() -> &'static str {
    "OK"
}
```

他の Web フレームワークと大体使い方一緒なので特に迷うことはなさそうですが一点だけ注意があります。

GitHub の main ブランチの README を見て、同じコードを書くと動きません。

以下のようなコードが書かれていますが、最新版の axum にまだこのコードが入っていないためです。

```rust
    axum::serve(listener, app).await.unwrap();
```

そのため、tag で特定のブランチに移動してから README などを見ることをお勧めします。

上記を実行すると、`localhost:3000` で `"OK"` と返すだけの API が作れます。

## Axum のエラーハンドリング

Axum で API のエラーハンドリングをする方法がよくわからなかったのですが、以下のような方法がとりあえずよさそうかなと思います。

`/search` エンドポイントがエラーハンドリングするとします。

Router の定義は通常通りで何も変更ありません。
```rust
    let app = Router::new()
        .route("/", get(index))
        .route("/search", get(search));

```

handler は以下のように定義します。

```rust
async fn search() -> Result<Json<ItemResponse>, AppError> {
    let resp = search_item().await?;
    Ok(Json(resp))
}

async fn search_item() -> anyhow::Result<SearchResult> {
    // SearchResult or anyhow::Error を返す処理
}
```

`AppError` 型は独自定義した型になります。

```rust
struct AppError(anyhow::Error);

// anyhow::Error => AppError への型変換
impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}

// AppError => axum::response::Response への型変換
// 自動的に、500 Internal Server Error になるようにハンドリング
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Internal Server Error: {}", self.0),
        )
            .into_response()
    }
}
```

まずanyhow::Error から AppError への型変換を定義することで、実際に処理する関数が、`anyhow::Result` 型で返せるようになります。

そして、AppError から IntoResponse への型変換を定義することで Response を作成できます。

## もう少し深堀り

フレームワーク側の挙動についてもうちょっと詳しく見るためにソースコードリーディングをします。

まずは AppError から IntoResponse への変換についてですが、今回 AppError に対して IntoResponse を実装し、内部でタプルの `into_response()` を呼びました。
Axum の内部で、以下のように、`StatusCode` と `IntoResponse` を実装した任意の型 `R` のタプルに対して、IntoResponse が定義されています。

- {{< exlink href="https://github.com/tokio-rs/axum/blob/d7258bf009194cf2f242694e673759d1dbf8cfc0/axum-core/src/response/into_response.rs#L341-L350" text="SourceCode">}}
```rust
impl<R> IntoResponse for (StatusCode, R)
where
    R: IntoResponse,
{
    fn into_response(self) -> Response {
        let mut res = self.1.into_response();
        *res.status_mut() = self.0;
        res
    }
}
```

次に get メソッドに Result 型を返す関数を渡せることも気になったのでもう少し見ます。

Axum に定義されている、`axum::routing::get` は macro になっていて、実態は `on` 関数がよばれます。

- {{< exlink href="https://github.com/tokio-rs/axum/blob/3b92cd7593a900d3c79c2aeb411f90be052a9a5c/axum/src/routing/method_routing.rs#L430-L438" text="SourceCode" >}}
```rust
pub fn on<H, T, S, B>(filter: MethodFilter, handler: H) -> MethodRouter<S, B, Infallible>
where
    H: Handler<T, S, B>,
    B: HttpBody + Send + 'static,
    T: 'static,
    S: Clone + Send + Sync + 'static,
{
    MethodRouter::new().on(filter, handler)
}
```

get に渡せるのは に渡せるのは、Handler 型 ですが、Handler 型は FnOnce 型に実装されています。

- {{< exlink href="https://github.com/tokio-rs/axum/blob/3b92cd7593a900d3c79c2aeb411f90be052a9a5c/axum/src/handler/mod.rs#L198-L257" text="SourceCode" >}}

##### 引数なし
```rust
impl<F, Fut, Res, S, B> Handler<((),), S, B> for F
where
    F: FnOnce() -> Fut + Clone + Send + 'static,
    Fut: Future<Output = Res> + Send,
    Res: IntoResponse,
    B: Send + 'static,
{
    type Future = Pin<Box<dyn Future<Output = Response> + Send>>;

    fn call(self, _req: Request<B>, _state: S) -> Self::Future {
        Box::pin(async move { self().await.into_response() })
    }
}
```

##### 引数ありはマクロで定義
```rust
macro_rules! impl_handler {
    (
        [$($ty:ident),*], $last:ident
    ) => {
        #[allow(non_snake_case, unused_mut)]
        impl<F, Fut, S, B, Res, M, $($ty,)* $last> Handler<(M, $($ty,)* $last,), S, B> for F
        where
            F: FnOnce($($ty,)* $last,) -> Fut + Clone + Send + 'static,
            Fut: Future<Output = Res> + Send,
            B: Send + 'static,
            S: Send + Sync + 'static,
            Res: IntoResponse,
            $( $ty: FromRequestParts<S> + Send, )*
            $last: FromRequest<S, B, M> + Send,
        {
            type Future = Pin<Box<dyn Future<Output = Response> + Send>>;

            fn call(self, req: Request<B>, state: S) -> Self::Future {
                Box::pin(async move {
                    let (mut parts, body) = req.into_parts();
                    let state = &state;

                    $(
                        let $ty = match $ty::from_request_parts(&mut parts, state).await {
                            Ok(value) => value,
                            Err(rejection) => return rejection.into_response(),
                        };
                    )*

                    let req = Request::from_parts(parts, body);

                    let $last = match $last::from_request(req, state).await {
                        Ok(value) => value,
                        Err(rejection) => return rejection.into_response(),
                    };

                    let res = self($($ty,)* $last,).await;

                    res.into_response()
                })
            }
        }
    };
}

all_the_tuples!(impl_handler);
```

上記の 定義では、`Res: IntoResponse` となっていますが、Result 型も IntoResponse を実装しているためため返すことができます。

- {{< exlink href="https://github.com/tokio-rs/axum/blob/d7258bf009194cf2f242694e673759d1dbf8cfc0/axum-core/src/response/into_response.rs#L146-L157" text="SourceCode" >}}

```rust
impl<T, E> IntoResponse for Result<T, E>
where
    T: IntoResponse,
    E: IntoResponse,
{
    fn into_response(self) -> Response {
        match self {
            Ok(value) => value.into_response(),
            Err(err) => err.into_response(),
        }
    }
}
```

この err のほうに AppError がわたるような構成にして、 into_response を AppError に対して定義したのでうまく処理ができたというわけでした。

## まとめ

今回は、Axum を使ってみてエラーハンドリング周りについてもメモしました。
axtix-web は以前使ってみていましたがそちらと同様こちらも使いやすそうだったのでもう少し試してみようかと思います。

余談ですが、ライブラリのコード読むと `IntoResponse` を使ってうまく汎用的につくられていてこのあたりかなり勉強になりました。
