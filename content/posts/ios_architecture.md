+++
categories = ["engineering"]
date = "2019-06-16"
title = "iOSアプリのアーキテクチャについて考えてみる"
thumbnail = ""
tags = ["swift", "iOS", "architecture"]
+++

こんにちは、[kz\_morita](https://twitter.com/kz_morita)です。\

普段はiOSアプリをSwiftで開発しているエンジニアです。\
最近は、Nuxt.jsを使ってWebフロントを書いてたりします。

最近iOS開発をしている中で、アーキテクチャについて考えることが多いのでそのことについて書いていこうと思います。

アーキテクチャは正解がないで常に模索し続けるのが良いですが、いったん現状の記録としてまとめておきます。多分しばらくしたらまた意見が変わってそうなので、あくまで参考程度に見ていただけたら嬉しいです。

## 先に結論

* iOSのアプリは規模にもよるがアーキテクチャを導入した方が良さそう
* Layered Architectureを意識して、MVP + UseCase + Model(Entity) + Repository くらいが良さそう

## そもそもアーキテクチャは必要なのか？

まず特定のアーキテクチャを採用する前に、本当に必要なのかは考えなければいけないポイントだと思います。

個人的には、アーキテクチャは導入した方が良いという意見でその理由は下記の通りです。

* iOSアプリという特性上どうしてもViewControllerの処理が増える
* UIの変更は頻繁に起きうるのでレイヤー化しておきたい

### Fat ViewController

iOSアプリはWebアプリなどと違って、その構造上Statefulになりやすいです。アプリ内で状態を持たずに実現できるアプリは限られてくるでしょう。

そうなってくると状態を保持するメンバ変数や、それらを更新する処理などのコードはどうしても増えてきます。

またネイティブアプリなので、アプリのライフサイクルを管理しなければなりません。

iOSアプリであれば、 `UIViewController` で `viewDidLoad` , `viewWillLayoutSubviews` , `viewWillAppear` などなどライフサイクルの各タイミングで呼ばれるメソッドを override して処理をハンドリングすることは必須であると思います。
そうなってくるとどうしても ViewControllerの処理内容は増えてきて、どうしても 見通しの悪い ViewController になってしまうリスクがあります。

そのため、何らかのアーキテクチャの導入は検討すべきだと思っています。\
(もちろんアプリの規模などにもよりますが)

### UIは詳細 

UIは特によく変更されうるものだと思っています。
以前書いた [書籍「Clean Architecture」を読んだまとめ](/posts/clean_architecture/) にも書きましたが、UIは実装の詳細でデザインや各OSの実装に依存している `詳細` です。

そのため、アプリの継続的なUpdateを実現するためにも、UIとそれ以外のロジックの部分の間で階層を作ること (= アーキテクチャを導入すること) は必要だと考えます。

## MVP

では本題のどのアーキテクチャを採用するのかといった件ですが、個人的にはMVPアーキテクチャが良さそうだなぁと思っています。

割と簡単に Fat ViewController を解決できると考えています。

では実際に、どんな感じのコードになるのか簡単なViewControllerとPresenterのコードを載せてみます。


##### MyViewController.swift
```swift
protocol MyView: class {
    func updateView()
}

class MyViewController: UIViewController {

    // Presenterを保持
    private lazy var presenter = MyPresenter(view: self)

    override func viewDidLoad() {
        super.viewDidLoad()

        presenter.viewDidLoad()
    }

    // MARK: - Action
    
    @IBAction func didTapButton(_ sender: UIButton) {
        presenter.didTapButton()
    }
}

extensions MyViewController: MyView {
    func updateView() {
        // Viewを更新したりする処理
    }
}
```


##### MyPresenter.swift

```swift
class MyPresenter {

    private weak var view: MyView?

    init(view: MyView) {
        self.view = view
    }

    func viewDidLoad() {

        // データ取得
        fetchData()

        // Viewを更新
        view?.updateView()
    }

    func didTapButton() {
        // ボタンが押された時の処理
    }
}

```

クラス図をかくと以下のような関係性になってます。

{{< mermaid >}}
classDiagram
    MyView <|-- MyViewController

    MyPresenter o-- MyView
    MyViewController o-- MyPresenter

    MyView : +updateView()
    MyPresenter : +viewDidLoad()
    MyPresenter : +didTapButton()
{{< /mermaid >}}

ViewControllerは、Presenterへ公開したいメソッドを定義したMyView protocol を実装します。そして、ViewControllerはPresenterを保持します。
Presenterからは、MyView protocolを保持します。

ことのきPresenter から Viewへの参照は 弱参照 (weak var) にしないと、相互に強参照してしまいメモリが解放されないため注意が必要です。

このようなアーキテクチャにすることで、ViewControllerは、Presenterへ処理を移譲するだけとなりViewControllerの肥大化を低減できるはずです。

### Model側の処理について

Model側は、PresenterからUseCaseを呼び出し、そのさきはData取得用のRepositoryなどを使用して処理を実行していけば良いと思います。

ここでは、レイヤードアーキテクチャを意識してコードを記述します。

下記の図に依存関係を表します。
{{< mermaid >}}
graph TD;
    Presentation-->Application
    Application-->Domain
    Infra-->Domain
{{< /mermaid >}}

これらの各レイヤーのクラスの内訳ですが、自分は以下のように解釈しています。

#### Presentation
- UIViewController
- UIView
- Presenter

#### Application
- UseCase

#### Domain
- Repository (protocol)
- Model (Userなど)

#### Infra
- RepositoryImpl (Repository protocolの実装)


重要なのは、Domain層が他のどこの層にも依存しないということです。そこさえ守れれば良いかなと思ってます。

---
それではModel側も簡単なコードを書いてみます。

##### MyPresenter.swift

Presenterが、UseCaseクラスを保持します。(Presentation → Applcation)\

UseCaseクラスは（自分の解釈では）Application層なので、Domain層にのみ依存すべきです。
RepositoryはDatabaseやAPI通信などの何らかの方法でデータを取得するクラスとして用意するのですが、
その取得方法（DBやAPI通信などの詳細）には依存しないようにすべきです。\
本当はDIライブラリなどを使って依存性を注入すべきですが、ここではPresenterで依存性を注入してます。



```swift
class MyPresenter {

    private weak var view: MyView?
    private var userUseCase: UserUseCase!

    init(view: MyView) {
        self.view = view

        // 依存を注入
        let userRepo = userRepositoryImpl()
        self.userUseCase = UserUseDase(userRepository: userRepo)
    }

    // ...


    private func fetchData() {
        let userId: UserId = 123456

        // Rxなどを使う場合は、callbackでなくそれらを返すようにする
        self.userUseCase.fetch(userId: userId) { user in 
            // View側に反映させたり
            self.view.updateView()
        }
    }
}
```

##### UserUseCase.swift

UseCaseはApplication層の想定なので、Repositoryの実装には依存しないようにDomain層のRepository protocolに依存するようにします。

```swift

class UserUseCase {
    
    private let repository: UserRepository

    init(userRepository: UserRepository) {
        self.repository = userRepository
    }

    func fetch(userId: UserId, completion: @escaping (User) -> Void) {

        // リポジトリなどを使ってユースケースを実現する
        self.repository.fetch(userId: userId, completion)
    }
}

```

##### UserRepository.swift

実装の詳細は、Infra層で行うため、ここではインターフェースのみ定義します。

```swift
protocol UserRepository {
    func fetch(userId: UserId, completion: @escaping (User) -> Void)
}
```

##### User.swift

Repositoryから取得されるモデルクラスです。

```swift
class User {
    let id: UserId
    let name: String

    // ...
}
```

##### UserRepositoryImpl.swift

Repositoryの実装クラスです。このクラスでは実際にデータを取得するライブラリへ依存します。
Firebaseだったり、Realmだったり、Alamofireだったりへはこの層で依存します。\
つまりこれらの外部ライブラリの import文章はInfra層(もしくはUIに関するライブラリはPresentation層)のみで記述されるはずです。

```swift
// 外部ライブラリへの依存
import Realm
import Alamofire

class UserRepositoryImpl: UserRepository {

    func fetch(userId: UserId, completion: @escaping (User) -> Void) {
        // ローカルDBや、APIをたたくなどして、Userの情報を取得する
    }
}
```

## ディレクトリ構成

ディレクトリ構成は好きなような感じで良いと思いますが、一例をあげるとすれば以下のような感じでしょうか？

```
Presentation
    - MyViewController.swift
    - MyPresenter.swift
    - SomeView.swift

Application
    - UserUseCase.swift

Domain
    - User.swift
    - UserRepository.swift

Infra
    - UserRepositoryImpl.swift
```


## まとめ

現状、iOSを開発する上で良さそうだなぁと思っているアーキテクチャについての考えを簡単にまとめました。\
個人的には、アーキテクチャは必要だけれども、厳密に特定のアーキテクチャに乗っ取る必要はないかなぁと思います。
(もちろん厳密にするのも選択肢としてありだと思います。)

大事なのは、依存の方向をしっかり管理すること（変更が多い部分が変更が少ない部分に依存するように）だと思っているので、そこさえ守れればあとは柔軟にやりやすい方向に変更・拡張していけば良いと思ってます。

アーキテクチャは正解がない (作るアプリケーションによる) ので、実装する上で考え続けていきたい一つの課題だと思います。
