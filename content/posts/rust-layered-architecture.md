+++
title="Rust でレイヤードアーキテクチャ"
date="2021-01-31T13:12:56+09:00"
categories = ["engineering"]
tags = ["rust", "architecture"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，Rustで API Server を作る上で，4層のレイヤードアーキテクチャを試してみたのでまとめていきます．

今回作成したものはこちらのリポジトリにあげています．

{{< exlink href="https://github.com/foresta/rust-api-architecture-sample" >}}

## レイヤードアーキテクチャについて

DDDや，クリーンアーキテクチャで採用されている，関心事単位で層を区切るアーキテクチャで主に，APIのHTTP周りの処理，アプリケーションの手続き，業務ドメイン，DBなどのインフラみたいに層があります．

今回は，以下のディレクトリ構造のような，レイヤーを作成してみました．

```
./src
├── domains
├── infrastructures
├── usecases
├── server
└── main.rs 
```

- `domain`: 業務ドメインなど，できるだけ外部のライブラリには依存しない
- `infrastructures`: DBなど, diesel などを使用する
- `usecases`: アプリケーション用の手続き
- `server`: HTTP 周りの処理,主に actix-web をつかって routing したりなど

また，Rustにおける Module の分け方については，前回のこちらの記事を参照してみてください．

[Rust における module について](/posts/rust-modules/)

## 実装

今回は，document という title と body を持つデータのCRUDを実装してみました．
実際の処理の流れどおり，main →  server →  usecases →  domains →  infrastructures という順番で紹介してみます．

### main.rs

今回は，main の処理はシンプルに server を実行するだけとしました．依存関係の注入などは server 側でやっています．

```rust
mod domains;
mod infrastructures;
mod server;
mod usecases;

fn main() -> std::io::Result<()> {
    server::run()
}
```

main.rs で，`mod domains` , `mod infrastructures` , `mod server` , `mod usecases` とすることで，他モジュールから `crate::domains::*` のような形で参照できるようになります．

### server

mod.rs が server モジュールのメインの処理を書いてます．
`server::run` 関数を actix_web のメインとして，その中で HTTPServer の生成と実行を行っています．

##### server/mod.rs

```rust
mod handlers;
mod request;
mod response;

use crate::domains::documents::DocumentRepository;
use actix_web::{App, HttpServer};
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, Pool};
use dotenv::dotenv;
use std::env;

#[actix_web::main]
pub async fn run() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .data(RequestContext::new())
            .service(handlers::get_documents)
            .service(handlers::get_document)
            .service(handlers::post_document)
            .service(handlers::delete_document)
            .service(handlers::update_document)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

#[derive(Clone)]
pub struct RequestContext {
    pool: Pool<ConnectionManager<MysqlConnection>>,
}

impl RequestContext {
    pub fn new() -> RequestContext {
        dotenv().ok();
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set");
        let manager = ConnectionManager::<MysqlConnection>::new(database_url);
        let pool = Pool::builder()
            .build(manager)
            .expect("Failed to create DB connection pool.");

        RequestContext { pool }
    }

    pub fn document_repository(&self) -> impl DocumentRepository {
        use crate::infrastructures::repository::documents::DocumentRepositoryImpl;

        DocumentRepositoryImpl {
            pool: Box::new(self.pool.to_owned()),
        }
    }
}
```

その他には，RequestContext という，データを準備して変数として，MySql の ConnectionPool をもたせるようにしました．

そして RequestContext から各種の Repository を生成するようにします．
上記の例の，DocumentRepositoryImpl は，Infrastructureモジュールですが，domains モジュールの DocumentRepository として公開することで，{{< exlink href="https://ja.wikipedia.org/wiki/%E4%BE%9D%E5%AD%98%E6%80%A7%E9%80%86%E8%BB%A2%E3%81%AE%E5%8E%9F%E5%89%87" text="DIP (Dependency Inversion Principle)" >}} を実現しています．

次に，actix_web で routing される処理は，handlers.rs に記載しました．

##### server/handler.rs
```rust
use super::request::*;
use super::response::*;
use super::RequestContext;
use crate::domains::documents::DocumentId;
use crate::usecases;
use actix_web::{delete, get, post, put, web, web::Json, HttpResponse, Responder};

#[get("/documents")]
async fn get_documents(data: web::Data<RequestContext>) -> impl Responder {
    match usecases::documents::get_document_list(data.document_repository()) {
        Ok(documents) => HttpResponse::Ok().json(DocumentListResponse::new(documents)),
        Err(_) => HttpResponse::InternalServerError().json(""),
    }
}

#[post("/documents")]
async fn post_document(
    data: web::Data<RequestContext>,
    request: Json<DocumentRequest>,
) -> impl Responder {
    // ...
}

#[get("/documents/{id}")]
async fn get_document(
    data: web::Data<RequestContext>,
    path_params: web::Path<(u32,)>,
) -> impl Responder {
    // ...
}

#[put("/documents/{id}")]
async fn update_document(
    data: web::Data<RequestContext>,
    path_params: web::Path<(u32,)>,
    request: Json<DocumentRequest>,
) -> impl Responder {
    // ...
}

#[delete("/documents/{id}")]
async fn delete_document(
    data: web::Data<RequestContext>,
    path_params: web::Path<(u32,)>,
) -> impl Responder {
    // ...
}

```

handers の各種関数からは，usecases モジュールの関数を呼び出し，結果の Result 型から，HttpResponse へのマッピングを行っています．
そのため，hander の処理自体はとても薄くなるように作っています．

Response で使っている DocumentListResponse などは，response.rs などに定義しています．
実装自体は以下のような感じで，Domain モデルから API Response 用のデータ (この場合 Json でSerialize できるデータ型) に変換しています．

##### server/resnpose.rs
```rust
use crate::domains::documents::Document;
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct DocumentListResponse {
    documents: Vec<DocumentDto>,
}

impl DocumentListResponse {
    pub fn new(docs: Vec<Document>) -> DocumentListResponse {
        DocumentListResponse {
            documents: docs.iter().map(|d| DocumentDto::new(&d)).collect(),
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct DocumentDto {
    id: u64,
    title: String,
    body: String,
}

impl DocumentDto {
    pub fn new(model: &Document) -> DocumentDto {
        DocumentDto {
            id: model.id.get(),
            title: model.title.to_owned(),
            body: model.body.to_owned(),
        }
    }
}
```

### usecases

usecase は以下のように Respositoryなどを用いてドメインモデルの手続きを行います．
このサンプルでは，シンプルな CRUD しか実装していないので，repository のメソッドを呼ぶことしかしていません．

```rust
use crate::domains::documents::{Document, DocumentId, DocumentRepository};
use failure::Error;

pub fn get_document_list(repository: impl DocumentRepository) -> Result<Vec<Document>, Error> {
    repository.list()
}

pub fn get_document(
    repository: impl DocumentRepository,
    document_id: DocumentId,
) -> Result<Document, Error> {
    // ...
}

pub fn post_document(
    repository: impl DocumentRepository,
    document: &Document,
) -> Result<(), Error> {
    // ...
}

pub fn update_document(
    repository: impl DocumentRepository,
    document: &Document,
) -> Result<(), Error> {
    // ...
}

pub fn delete_document(
    repository: impl DocumentRepository,
    document_id: DocumentId,
) -> Result<(), Error> {
    // ...
}
```

### domains

domains では，業務ロジックや，モデルを定義しています．また，Repository Traitもここで定義しています．
Simpleな CRUD なので，業務ロジックがなくデータの定義しかしていませんが基本的なロジックはこのあたりに書かれることを想定しています．

##### domains/documents.rs

```rust
use super::Id;
use failure::Error;

pub type DocumentId = Id<Document>;

#[derive(Debug, Clone)]
pub struct Document {
    pub id: DocumentId,
    pub title: String,
    pub body: String,
}

impl Document {
    pub fn create(title: String, body: String) -> Self {
        Self {
            id: Default::default(),
            title: title,
            body: body,
        }
    }
}

pub trait DocumentRepository {
    fn find_by_id(&self, document_id: DocumentId) -> Result<Document, Error>;
    fn list(&self) -> Result<Vec<Document>, Error>;
    fn insert(&self, document: &Document) -> Result<(), Error>;
    fn update(&self, document: &Document) -> Result<(), Error>;
    fn delete(&self, document: &Document) -> Result<(), Error>;
}
```

### infrastructures


infrastructures 層では，Repository の実装と，diesel による database の schema 管理も行っています．

##### infrastructures/repostiroy/documents.rs

```rust
use super::super::database::schema::*;
use crate::domains::documents::{Document, DocumentId, DocumentRepository};
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, Pool};
use failure::Error;

//
// Entity
//

#[derive(Debug, Clone, Eq, PartialEq, Hash, Queryable, Identifiable, AsChangeset)]
#[table_name = "documents"]
pub struct DocumentEntity {
    pub id: u64,
    pub title: String,
    pub body: String,
}

impl DocumentEntity {
    fn from(model: &Document) -> DocumentEntity {
        DocumentEntity {
            id: model.id.get(),
            title: model.title.to_owned(),
            body: model.body.to_owned(),
        }
    }

    fn of(&self) -> Document {
        Document {
            id: DocumentId::new(self.id),
            title: self.title.to_owned(),
            body: self.body.to_owned(),
        }
    }
}

pub struct DocumentRepositoryImpl {
    pub pool: Box<Pool<ConnectionManager<MysqlConnection>>>,
}

impl DocumentRepository for DocumentRepositoryImpl {

    fn list(&self) -> Result<Vec<Document>, Error> {
        use super::super::database::schema::documents::dsl;

        let query = dsl::documents.into_boxed();
        let conn = self.pool.get()?;
        let results: Vec<DocumentEntity> = query.limit(100).load(&conn)?;

        Ok(results.into_iter().map(|e| e.of()).collect())
    }


    fn find_by_id(&self, document_id: DocumentId) -> Result<Document, Error> {
        // ...
    }

    fn insert(&self, document: &Document) -> Result<(), Error> {
        // ...
    }

    fn update(&self, document: &Document) -> Result<(), Error> {
        // ...
    }

    fn delete(&self, document: &Document) -> Result<(), Error> {
        // ...
    }
}
```

repository の実装では，DB用の Entity モデルと，Respository が含まれます．今回は，diesel を使用していて，データを取得する処理はこの層に書いていきます．
ConnectionPool 自体は，`server/mod.rs` で渡されているものを使用しています．


また，DBのスキーマは以下のように管理することにしました．

##### infrastructures/database/schema.rs

```rust
table! {
    documents (id) {
        id -> Unsigned<Bigint>,
        title -> Varchar,
        body -> Text,
    }
}
```

これは，サンプルのリポジトリ直下に以下のような設定をすることで吐き出しています．

##### diesel.toml
```
[print_schema]
file = "src/infrastructures/database/schema.rs"
```

## まとめ

今回は，Rust でレイヤードアーキテクチャをしてみる一例を紹介しました．

Simpleなアプリケーションには，ここまでレイヤー化するのはやりすぎ感が否めないですがある程度の規模になったときにレイヤー化されていると，変更を管理しやすくなるメリットがあるかなと思っています．

Rustでの，module とかディレクトリ構造とか，なれないうちはちょっと戸惑いがありましたがようやく使えるようになってきた感があります．
個人の趣味開発で実際にこのアーキテクチャを使用してみているので，開発がすすんで複雑化してきたときにまたこのアーキテクチャがどうだったのか，振り返ってみたいなと思います．

