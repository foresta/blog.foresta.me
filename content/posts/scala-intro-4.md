+++
title="Scala入門 その4 トレイト"
date="2021-10-17T17:57:00+09:00"
categories = ["engineering"]
tags = ["scala", "trait"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala 入門 その4 ということで、トレイトについてまとめます。

## トレイトの基本

トレイトは、実装をクラスに合成 (Mixin) するために使用されます。

`extends` または、`with` によってクラスに Mixin できます。

下記では従業員クラス (Employee) に、Displayable という表示用のトレイトを合成してみます。

```scala
// トレイトを定義
trait Displayable {
  val name: String

  def display() = {
    println(name)
  }
}

// トレイトを mixin
class Employee(val id: Int, val name: String) extends Displayable
```

以下のように `display` メソッドをよび出すことができます。

```scala
val taro = Employee(1, "Taro")
taro.display() // => Taro
```

すでに親クラスがある場合や、複数合成する場合には、`with` を使用します。

```scala
class Person(val name: String)
class Employee(val id: Int, name: String) extends Person(name) with Displayable
```

トレイトの特徴として以下のような点があります。

- インスタンス化はできない (あくまで Mixin 用)
- コンストラクタの引数が受け取れない
- メンバ変数、メソッド (実装) をもてる


### Ordered トレイトの例

ここまでで、定義した Employee クラスをソートできるようにしてみます。
Scala に用意されている、Ordered トレイトを Mixin してみます。

```scala
class Employee(val id: Int, name: String)
  extends Person(name)
    with Displayable
    with Ordered[Employee] {

  // Ordered トレイトで定義されていて、Mixin するクラスで実装しなければいけない
  def compare(that: Employee) : Int = {
    this.id - that.id
  }

}
```

Ordered トレイトの定義を見てみます。定義は以下のようになっています。

```scala
trait Ordered[A] extends scala.Any with java.lang.Comparable[A] {
  def compare(that : A) : scala.Int
  def <(that : A) : scala.Boolean = { /* ... */ }
  def >(that : A) : scala.Boolean = { /* ... */ }
  def <=(that : A) : scala.Boolean = { /* ... */ }
  def >=(that : A) : scala.Boolean = { /* ... */ }
  def compareTo(that : A) : scala.Int = { /* ... */ }
}
object Ordered extends scala.AnyRef {
  implicit def orderingToOrdered[T](x : T)(implicit ord : scala.math.Ordering[T]) : scala.math.Ordered[T] = { /* compiled code */ }
}
```

compare メソッドのみ実装が与えられていないので、これは合成するクラスの方で実装する必要があります。

比較系の `<` や `>=` は実装されていますが、これらのメソッドは compare メソッドを使用して実装されていて、compareだけ実装すればこれらのメソッドが使用できます。

```scala
// 使用例
println(Employee(1, "Taro") < Employee(3, "Hanako")) // ID で比較するので true
```

Ordered トレイトを実装したので、List のソートができるようになります。

```scala
val employees = List(
  Employee(1, "Taro"),
  Employee(3, "Hanako"),
  Employee(2, "Bob")
)
employees.foreach(_.display())  // Taro => Hanako => Bob
employees.sorted.foreach(_.display()) // Taro => Bob => Hanako
```

## 複数トレイトと線形化、順番

これまでの例でも、複数のトレイトを Mixin してきました。

インスタンスの生成時にも トレイトを Mixin することができます。

新たに文字を Format するための Formatter トレイトを考え、Displayable が Formatter トレイトを使用するようにします。

```scala
trait Formatter {
  def format(): String
}

trait Displayable extends Formatter {
  def display() = {
    println(format())
  }
}

trait Formatter_1 extends Formatter {
  abstract override def format(): String = {
    s"1 => ${super.format()}"
  }
}

class Employee(val id: Int, val name: String) extends Displayable {
  def format() = name
}
```

Formatter_1 というトレイト をインスタンス生成時に Mixin してみます。

```scala
  {
    val taro = new Employee(1, "Taro")
    taro.display() // Taro
  }
  {
    val taro = new Employee(1, "Taro") with Formatter_1
    taro.display() // 1 => Taro 
  }
```

上記のように、Formatter_1 のformat が呼ばれた後に、Employee クラスで定義した format が呼ばれています。

複数のトレイトを Mixin する場合は、基本的に右側から順番に実行されます。

以下のような Formatter の定義の場合、

```scala
trait Formatter_1 extends Formatter {
  abstract override def format(): String = {
    s"1 => ${super.format()}"
  }
}

trait Formatter_2 extends Formatter {
  abstract override def format(): String = {
    s"2 => ${super.format()}"
  }
}

trait Formatter_2_A extends Formatter_2 {
  abstract override def format(): String = {
    s"2_A => ${super.format()}"
  }
}

class Employee(val id: Int, val name: String) extends Displayable {
  def format() = name
}
```

以下のような実行結果になります。

```scala
  {
    val taro = new Employee(1, "Taro")
    taro.display() // Taro
  }
  {
    val taro = new Employee(1, "Taro") with Formatter_1
    taro.display() // 1 => Taro
  }
  {
    val taro = new Employee(1, "Taro") with Formatter_1 with Formatter_2_A
    // 2_A の後に、親クラスの 2 に行ってその後 1 ...
    taro.display() // 2_A => 2 => 1 => Taro
  }
  {
    val taro = new Employee(1, "Taro") with Formatter_2_A with Formatter_1
    taro.display() // 1 => 2_A => 2 => Taro
  }
```

これを利用すれば以下のような実行時間を計測するような処理を簡単に書くことができます。
(AOP が簡単に実現できますね)
```scala
trait Executor {
  def execute(): Unit
}

trait StopWatch extends Executor {
  abstract override def execute() = {
    println("StopWatch Started")
    val start = System.currentTimeMillis()
    super.execute()
    println("ExecTime： " + (System.currentTimeMillis - start) + "(ms)")
  }
}

class Factorial(num: Int) extends Executor {
  def execute() = {
    println(s"$num! = ${factorial(num)}")
  }

  def factorial(n: Long): Long = {
    Thread.sleep(1) // わざと遅く
    n match {
      case n if n <= 1 => 1
      case _ => n * factorial(n-1)
    }
  }
}
```

上記は、階乗を求めるプログラムで StopWatch トレイトを mixin することによって時間の計測ができます。
呼び出し側は以下のような感じ。

```scala
val executor= new Factorial(20) with StopWatch
executor.execute()
```

以下のような実行結果になります。

```
StopWatch Started
20! = 2432902008176640000
ExecTime： 25(ms)
```


## まとめ

今回は、トレイトについてまとめました。

基本的にトレイトを用いて設計していくと再利用しやすいコードにできそうだなと思います。ポリモーフィズムなども trait の型で行えるので、基本的にはトレイトを使い、どうしてもクラスパラメータ (コンストラクタに渡す引数) が必要な時などは抽象クラスなどといった使い分けが良さそうです。

そのほかには Java のクラスから継承したいなどといった時も抽象クラスを使った方が良いかもしれません。

