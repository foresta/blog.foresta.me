+++
title="Kotlkn で書いた API から TypeScript の型定義ファイルを生成する"
date="2020-09-20T22:19:22+09:00"
categories = ["engineering"]
tags = ["kotlin", "typescript"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

SPAを開発する際に，APIサーバーと，フロントエンドが別の言語になることは度々起こると思いますが，Response や Request の型を共通のものを使用することにより，APIの疎通などの確認がとりやすいと感じています．

現在の開発プロジェクトでは，Kotlin で開発した API サーバーの Response から, TypeScript の型定義ファイル (d.ts) を生成する仕組みを導入しました.

この記事では，その方法について書いていきます．


## API 側の実装

今回の例として，ユーザーの
API で返すレスポンスの型は以下の様なものになっているとします．

```kt
package com.example.web.response.user

/**
 * ユーザー情報の API レスポンス用データ
 *
 * @property userId ユーザーID
 * @property name 氏名
 * @property icon アイコン画像
 * @property email メールアドレス
 */
class UserDetailResponse(
    val userId: Long,
    val name: String,
    val icon: String,
    val email: String
)
```

実際に値を返す，処理は以下のような感じと想定してください．

```kt
package com.example.web.resource.user

import com.example.application.user.UserUseCase
import com.example.domain.user.UserDetail
import com.example.web.response.user.UserDetailResponse
import com.github.salomonbrys.kodein.LazyKodein
import com.github.salomonbrys.kodein.LazyKodeinAware
import com.github.salomonbrys.kodein.instance
import javax.inject.Inject
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType

/**
 * ユーザー情報を返す API Resource
 */
@Path("/users")
class UsersResource @Inject constructor(override val kodein: LazyKodein) : LazyKodeinAware {

    private val useCase: userUseCase by instance()

    /**
     * ユーザーの詳細情報の取得API
     */
    @Path("/{id:\\d+}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    fun getDetail(): UserDetailResponse {
        val userDetail = useCase.getDetail()
        return UserDetailResponse.from(userDetail)
    }
}
```

`UserUseCase` クラスから，ユーザー詳細情報を取得して，API Response に変換しているというコードになります．

これらから，以下のような 型定義ファイルを生成することが今回のゴールとなります．

#### api_response.d.ts
```ts
interface UserDetailresponse {
  userId: number;
  name: string;
  icon: string;
  email: string;
}
```


## TypeScript の型定義ファイルを生成

今回，型定義ファイルを生成するにあたり，{{< exlink href="https://github.com/ntrrgc/ts-generator" text="ts-generator">}} というライブラリを使用し，最終的には，shell を叩くと，特定のディレクトリに 型定義ファイルが出力されるといったものを作成しました．

処理としては，以下のようなフローで型定義ファイルの生成を行います．

- 対象のパッケージ一覧を，shell script でリストアップ
- 型定義生成用のKotlin の処理に，標準入力でパッケージ一覧を渡す
- ts-generatorに渡した結果を標準出力に吐く
- 標準出力に吐かれた型定義ファイルを shell 側でファイルに保存


それでは，まず実際に型定義ファイルを生成する際に実行する shell script を記載します．

#### /scripts/api_response/gen_api_definition.sh
```sh
#!/bin/bash

set -eu

cd `dirname $0`

# このスクリプトファイルからプロジェクトルートまで移動
cd `pwd`/../..

PROJECT_ROOT=`pwd`

# 型定義ファイルを出力したいクラスが格納されているディレクトリへのパス
# 今回で言うと，API Response クラス
API_RESPONSE_DIR=$PROJECT_ROOT/example-api/src/main/kotlin/com/example/web/response

# 出力するディレクトリ
OUT_DIR=$PROJECT_ROOT/scripts/api_response/out
mkdir -p $OUT_DIR

OUTPUT_FILE=$OUT_DIR/api_response.d.ts

echo "Project root: " $PROJECT_ROOT
echo ""
echo "Convert the following class"

# find で，対象のクラスをリストアップ
# ファイル名と，クラス名が一致しているという前提
# sed でファイルパスから，kotlin の 完全修飾名へと変換する
#  - フルパスなので，PROJECT_ROOT までのパス名を削除
#  - src/main/kotlin までのパスも削除 
#  - パスの「/」を「.」に変換する
echo "[RESPONSE]"
find $API_RESPONSE_DIR -name *.kt \
    | sed -e 's|'$PROJECT_ROOT'||g' \
    | sed -e 's/\/example-api\/src\/main\/kotlin\///g' \
    | sed -e 's/\//./g' | sed -e 's/\.kt$//g' \

echo ""
echo "Generating..."
echo ""

echo "" > $OUTPUT_FILE

# 列挙した Kotlin の完全修飾名を kt2ts という独自に定義した gradle タスクに渡してその結果をファイルに書き込む
find $API_RESPONSE_DIR -name *.kt \
    | sed -e 's|'$PROJECT_ROOT'||g' \
    | sed -e 's/\/example-api\/src\/main\/kotlin\///g' \
    | sed -e 's/\//./g' | sed -e 's/\.kt$//g' \
    | ./gradlew tools:kt2ts -q >> $OUTPUT_FILE

echo "Generated successfly."
echo $OUTPUT_FILE " is generated."
echo ""
echo "[Note] Please commit the generated files to the frontend repository."
```

上記では，まず find コマンドなどを使用して，型定義ファイルを生成するクラスの 完全修飾名 (パッケージ名 + クラス名) の一覧を生成します．
そのあと，そのリストを gradle のタスクにわたし，後述のts-generator で型定義を出力ルーチンで処理をします．

shell script から呼び出すために，以下の様な gradle タスクを定義しました．

#### build.gradle
```
project("tools") {
    dependencies {
        compile project(":example-api")
        compile 'org.reflections:reflections:0.9.11'
        implementation 'com.github.ntrrgc:ts-generator:1.1.1'
    }

    task kt2ts(type: JavaExec) {
        standardInput = System.in
        classpath = sourceSets.main.runtimeClasspath
        main = "com.example.tools.ts_definition_generator.TypeScriptDefinitionGenerator"
    }
}
```

今回はメインのプロジェクトとは別に，tools というサブモジュールを定義してそのクラスを実行する，`kt2ts` というタスクを定義しました．

前述の shell scriptから，以下のように呼び出しています．

```sh
./gradlew tools:kt2ts -q >> $OUTPUT_FILE # <- この行
```

ここで注意なのですが， gradlew で実行するときに， `-q` オプションを指定しないと，gradle の実行する際のログも標準出力に書かれてしまいます．`-q` をつけることでこれが抑制できます．

詳しくはこちら．\
http://gradle.monochromeroad.com/docs/userguide/logging.html


最後に，実際に ts-generator を用いて，TypeScript の型定義を出力するクラスを見ていきましょう．

```kt
package com.example.tools.ts_definition_generator

import com.example.web.annotation.type_definition.IgnoreTypeDefinition
import jdk.nashorn.internal.ir.annotations.Ignore
import me.ntrrgc.tsGenerator.TypeScriptGenerator
import java.time.ZonedDateTime
import java.util.Date

/**
 * Kotlinのクラスパス から TypeScript の 型定義ファイルに変換します
 *
 * 標準入力で，与えられた パッケージ名 + クラス名の 文字列から KClass に変換し，
 * KClass を TypeScript の 型定義として 標準出力にはきます．
 */
object TypeScriptDefinitionGenerator {

    @JvmStatic
    @Suppress("SpreadOperator")
    fun main(args: Array<String>) {

        // 標準入力から得た，クラスを kClass に変換
        val allClasses = generateSequence(::readLine).map { Class.forName(it).kotlin }.toSet()

        println(
            TypeScriptGenerator(
                // 特定のAnnotation (@IgnoreTypeDefinition) がついているクラスは無視
                rootClasses = allClasses.filter { it.annotations.find { annotation -> annotation is IgnoreTypeDefinition } == null },
                mappings = mapOf(
                    // Kotlin (Java) の日付型をTypeScript の日付型に明示的にマッピング
                    Date::class to "Date",
                    ZonedDateTime::class to "Date",
            ).definitionsText
        )
    }
}
```

今回は，指定した パッケージ内にあるが型定義ファイルを出力したくないというクラスにも対応するため．`@IgnoreTypeDefinition` というカスタムアノテーションを定義し，それがついているクラスは型定義の対象から除外しています．

```kt
package com.example.web.annotation.type_definition

/**
 * 型定義ファイルの対象外
 */
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
annotation class IgnoreTypeDefinition
```

また，ZonedDateTime などは，TypeScript の Date 型として扱いたいため明示的にマッピングを書いています．

```kt
TypeScriptGenerator(
    rootClasses = allClasses.filter { it.annotations.find { annotation -> annotation is IgnoreTypeDefinition } == null },
    mappings = mapOf(
        // Kotlin (Java) の日付型をTypeScript の日付型に明示的にマッピング
        Date::class to "Date",
        ZonedDateTime::class to "Date", 
    )
).definitionsText
```

これを println で出力すると，以下のような目的の型定義を出力することができます．

#### api_response.d.ts
```ts
interface UserDetailresponse {
  userId: number;
  name: string;
  icon: string;
  email: string;
}
```


## 改善点とか

本当は，Kotlin だけで，指定したパッケージ内のクラスを一覧で取得するといったことがしたかったのですがぱっとやり方がわからなかったため，shell を使ってカバーしました．ここぜひうまいやり方に改善したいポイントです．

あとは，現状，ファイル名とクラス名が一致していないとうまく生成できなかったり暗黙のルールがあるのでそういったところを柔軟に対応できるともっと使いやすくなりそうです．

## まとめ

今回は，Kotlin のクラスから，TypeScript の型定義ファイルを生成する方法を紹介しました．

この仕組みをつくった結果，実際にAPI開発をしてから型定義ファイルを生成し，それをフロントエンド側のリポジトリへ Pull Request 出して，フロントを担当する人とすり合わせをするという運用ができています．

Response の型について事前にすり合わせができるので，その後の開発がスムーズに出来ていると感じてます．
Swagger UI なども導入してますが，Pull Request ベースでのすり合わせが今のところ良さそうです．


こういった，開発環境を改善する系のタスクは楽しいし，長期的な目で見てメリットが大きくなってくるので色々と整備していきたいところです．
