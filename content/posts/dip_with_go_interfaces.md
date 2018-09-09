+++
title = "DIPを意識してgoを書いてみる"
thumbnail = ""
tags = ["golang", "solid", "architecture", "dip"]
categories = ["engineering"]
date = "2018-09-09"

+++

## 背景
go言語を触っていて、DuckTypingによるインターフェースとDIPとの相性がかなり良いものだなぁ感じ試して見た記事です。

[以前のアーキテクチャについての記事](/posts/clean_architecture/)にも書きましたが、ソフトウェアの詳細にビジネスロジックが依存しない方が好ましく、\
できれば実装の詳細についての判断をできるだけ遅くすることがアーキテクトの腕の見せ所と言えます。

そこで今回は以下のユースケースをDBに依存することなく実装を進めて見たいと思います。

* ユーザー一覧の表示
* ユーザーの登録

ソースコードはこちら(http://github.com/foresta/go-dip-sample)

## DIPとは

SOLIDの原則と言われるクラス設計の原則の中の一つで、日本語だと依存関係逆転の原則と言います。



## ソースコード

全体のファイル構成はこんな感じです。
```
src/
├── memory                      
│   └── user_repository.go
├── mysql                      
│   └── user_repository.go
├── server.go
└── user
    ├── user.go
    └── user_repository.go
```

パッケージは user, memory, mysql の三つで user がソフトウェアドメインに関するパッケージ、
memory, mysqlはデータストア (インフラ) に関するパッケージです。
今回はmysqlを準備することなくメモリ上にユーザーデータを保存をできるようにします。

ユーザーは以下のようなデータ構造とします。

```go
// user.go
package main

type User struct {
    ID int
    Name string
    Email string
}
```

保存にはUserRepositoryというインターフェースを使用することにします.

```go
// user_repository.go
package user

type Repository interface {
    Store(u *User) error
    FindAll() []*User
}

```

以下にmainパッケージの処理全てを載せます。\

```go
// server.go

package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/foresta/go-dip-sample/src/memory"
	"github.com/foresta/go-dip-sample/src/user"
	"github.com/gorilla/mux"
)

var user_repository user.Repository

func main() {

	user_repository = memory.NewUserRepository()

	r := mux.NewRouter()
	r.HandleFunc("/users", createUserHandler).Methods("POST")
	r.HandleFunc("/users", listUsersHandler).Methods("GET")

	srv := &http.Server{
		Handler: r,
		Addr:    "127.0.0.1:8000",

		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}

func listUsersHandler(w http.ResponseWriter, r *http.Request) {
	type User struct {
		ID    int    `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	type response struct {
		Users []*User `json:"users"`
	}

	// user一覧取得
	users := user_repository.FindAll()

	responseUsers := make([]*User, 0, len(users))
	for _, user := range users {
		u := &User{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
		}
		responseUsers = append(responseUsers, u)
	}
	res := &response{Users: responseUsers}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	json.NewEncoder(w).Encode(res)

}

func createUserHandler(w http.ResponseWriter, r *http.Request) {

	var body struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	var err error
	err = json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"msg": "error. user not created.",
		})
		return
	}

	u := user.NewUser(body.Name, body.Email)
	err = user_repository.Store(u)

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"msg": "user created.",
	})
}
```

まず一番初めに、`memory.UserRepository` を使用するためここで依存を注入しています。

```go
var user_repository user.Repository

func main() {
    user_repository = memory.NewUserRepository()

    // ...省略
}
```

そしてそのリポジトリを利用して、ユーザー一覧の取得とユーザーの作成行います。

```go
func listUsersHandler(w http.ResponseWriter, r *http.Request) {

    // ......省略

	// user一覧取得
	users := user_repository.FindAll()

    // ......
}

func createUserHandler(w http.ResponseWriter, r *http.Request) {

    // ......省略

	u := user.NewUser(body.Name, body.Email)
	err = user_repository.Store(u)


    // ......
}
```

このようにすることでDBの詳細に依存することなくユーザーに関する処理の実装を進められます。

もし仮に、mysqlを使用するように変更になった場合、
mysql/user_repository.goを実装し,以下のようにすることでデータストアを切り替えることができます。

```
func main() {

    user_repository = mysql.NewUserRepository()

    // ...
}
```

結果として、mysqlを使用するという判断をせずとも、ドメインに関する実装を進めることができます。

## 実行

実行して見ます

```
$ cd path/to/project
$ go run ./src/server.go
```

リクエストを投げます。
```
$ curl --silent -H "GET" localhost:8000/users | jq
{
    "users": []
}


$ curl --silent -H "POST" -d '{"name":"user1","email":"user1@example.com"}' localhost:8000/users | jq
{
  "msg": "user created."
}


$ curl --silent -H "GET" localhost:8000/users | jq
{
  "users": [
    {
      "id": 1,
      "name": "user1",
      "email": "user1@example.com"
    }
  ]
}
```

うまく動いてそうです。


## 依存関係

以下のような依存の方向になっています。

```
// main
main -> memory
main -> user

// memory
memory -> user
```


もし仮に、user_repositoryをinterfaceにせずに実装すると、mysqlやmemoryへの保存処理を `user/user_repository.go` に書くことになり、以下のような依存方向になるかと思います。

```
// main
main -> user

// user
user -> memory or mysql
```

こうするとDBの変更の際にuserパッケージに手を入れる必要が出てきます。
このようにuserパッケージ内をDBなどの詳細な変更から守ることがDIPの主な使用目的でしょう。

## Duck Typingについて

個人的には、抽象と具象を明示的に紐づける必要がなくコーディングが楽で良いです。

あとは、このインターフェース満たさなければ許さないよ感が継承ベースのinterfaceよりも感じられて好きです (これは多分気のせい)


## まとめ

* 依存方向を気にしながらコーディングするのは大切
* Duck Typingによるポリモーフィズムは書いてて楽しい
* golang良いぞ
