+++
title="Mockito でメソッドの呼び出し回数のテストをする"
date="2022-12-04T21:36:12+09:00"
categories = ["engineering"]
tags = ["mockito", "test", "scala"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Mockito で メソッドが呼ばれるかどうか、何回呼ばれるかをテストするコードを書いたのでメモです。

- {{< exlink href="https://github.com/mockito/mockito" text="Mockito | github">}}
- {{< exlink href="https://site.mockito.org/" text="mockito.org" >}}
- {{< exlink href="https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html" text="Mockito document">}}

## Test したい処理

今回は以下のようなメソッドをテストしたいとします。

```scala
class ItemService(itemRepository: ItemRepository) {

    def getItems(user: User): Seq[Item] = {
        if (user.isLoggedIn) {
            itemRepository.getUserItems(user.id)
        } else {
            itemRepository.getAllItems()
        }
    }
}
```

仮ですが、ユーザークラスを渡して Item のリストを取得するといったシチュエーションです。ログイン済みであればそのユーザーに関連するアイテムを取得し、未ログインであれば全アイテムを取得するといった内容です。

## mock しつつテストを書く


まずは必要そうなメソッドやクラスを mock します。

```scala
// ItemRepository を Mock
val itemRepository: ItemRepository = mock[ItemRepository]

// getAllItems, getUserItems の戻り値を設定. 両方とも空リストを返すとする
when(itemRepository.getAllItems()).thenReturn(Nil)
when(itemRepository.getUserItems(anyInt())).thenReturn(Nil)

val itemService = new ItemService(itemRepository)
```

when で実際のメソッドをmock します。

これで準備ができたので実際にメソッドが呼ばれるかどうかのテストをします。
未ログインユーザーの場合の挙動をテストします。

```scala
// 未ログインユーザーを渡して getItems を呼ぶ
itemService.getItems(User(isLoggedIn = false, id = 0))

// getAllItems が 1 回呼ばれること 
verify(itemRepository, times(1)).getAllItems()

// getUserItems が 0 回呼ばれること(呼ばれないこと)
verify(itemRepository, times(0)).getUserItems(anyInt())
```

ログイン済みユーザーの場合の挙動をテストします。

```scala
// ログイン済みユーザーを渡して getItems を呼ぶ
itemService.getItems(User(isLoggedIn = true, id = 1))

// getAllItems が 0 回呼ばれること 
verify(itemRepository, times(0)).getAllItems()

// getUserItems が 1 回呼ばれること
verify(itemRepository, times(1)).getUserItems(anyInt())
```

verify メソッドと、times() メソッドで、実際にメソッドが何回呼ばれるかをテストすることができます。

## Tips

### 回数をテストするそのほかのメソッド

times メソッドのほかに以下のようなメソッドが用意されてます。

- `never()`
  - times(0) と一緒
- `atMostOnce()`
  - 多くとも 1 回
- `atLeastOnce()`
  - 少なくとも 1 回
- `atMost(5)`
  - 多くとも 5 回
- `atLeast(5)`
  - 少なくとも 5 回

ほかにも使えるメソッドなどは、{{< exlink href="https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html" text="公式のリファレンス" >}} を参照してみてください。

### Mock したメソッド内で引数の値を利用したい

例えば、getUserItems で渡された user の id が何かを確認したい場合は、thenReturn でなく、thenAnswer を利用する必要があります。

```scala
when(itemRepository.getUserItems(anyInt())).thenAnswer((invocation: InvocationOnMock) => {
    val userId = invocation.getArgument[Int](0)
    println(s"userId: ${userId}")

    Nil
})
```

上記のように書くことで、実際に渡された userId を確認できます。
ログイン済みユーザー `User(isLoggedIn = true, id = 1)` を渡したとすると以下のように表示されるはずです。

```
userId: 1
```

## まとめ

今回は、Mockito を用いてメソッドの呼び出し回数をテストする書き方についてメモしました。

呼び出し回数によるテストは、主にレイヤードアーキテクチャなどの Application 層のふるまいをテストするのに非常に役に立つと思います。Domain層だけでなく、Application 層もテストを充実させていきたいので Mockito の呼び出し回数テストの仕組みは非常に有用だと思いました。
