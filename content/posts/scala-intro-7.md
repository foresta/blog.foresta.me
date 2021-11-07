+++
title="Scala入門 その7 テスト"
date="2021-11-07T18:54:55+09:00"
categories = ["engineering"]
tags = ["scala", "test", "unittest"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Scala 入門の その 7 ということでテストについてまとめます。

## Scala のテストフレームワーク

Scala で使用できるテストフレームワークには以下のようなものがあります。

- {{< exlink href="https://www.scalatest.org/" text="ScalaTest" >}}
- {{< exlink href="https://etorreborre.github.io/specs2/" text="specs2" >}}
- {{< exlink href="https://www.scalacheck.org/" text="ScalaCheck" >}}

今回は、ScalaTest を利用したテストを書いていきます。

前提として、以下のような FizzBuzz をするコードのメソッド `fizzBuzz` をテストしてみます。

```scala
object Main extends App {

  def fizzBuzz(num: Int): String = {
    require(num > 0)

    num match {
      case num if num % 15 == 0 => "FizzBuzz"
      case num if num % 3 == 0 => "Fizz"
      case num if num % 5 == 0 => "Buzz"
      case _ => num.toString
    }
  }

  (1 to 100).map(fizzBuzz).foreach(println)
}
```

## ScalaTest の準備

sbt プロジェクトを使用する前提なので、build.sbt に scalatest を追加します。

今回は、この記事執筆時点での最新版である 3.2.10 を使用してみます。

```
name := "ScalaUnitTestSample"

version := "0.1"

scalaVersion := "2.13.7"

libraryDependencies += "org.scalatest." %% "scalatest" % "3.2.10" % Test
```

## FlatSpec を使用したテスト

FlatSpec を使用して以下のようにテストがかけます。

```scala
import Main.fizzBuzz
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should

class FizzBuzzSpec extends AnyFlatSpec with should.Matchers {

  "FizzBuzz" should "Return Fizz if Multiple of 3" in {
    fizzBuzz(3) should be ("Fizz")
    fizzBuzz(99) should be ("Fizz")
  }

  "FizzBuzz" should "Return Buzz if Multiple of 5" in {
    fizzBuzz(5) should be ("Buzz")
    fizzBuzz(20) should be ("Buzz")
  }

  "FizzBuzz" should "Return FizzBuzz if Multiple of 5 and 3" in {
    fizzBuzz(15) should be ("FizzBuzz")
    fizzBuzz(90) should be ("FizzBuzz")
  }

  "FizzBuzz" should "Return input number if neither a multiple of 3 nor a multiple of 5" in {
    fizzBuzz(1) should be ("1")
    fizzBuzz(97) should be ("97")
  }

  "FizzBuzz" should "throw Exception if arg was negative number" in {
    an [IllegalArgumentException] should be thrownBy fizzBuzz(-1)
  }
}
```

FlatSpec を使うとかなり自然言語に近い形でテストがかけるので良さそうです。

ちなみに assertion を `should be` というメソッドで書いていますが、これは、`with should.Mathers` と トレイトを Mixin することで使えるようになります。

一応これを使用しなくても、以下のようにかけます。

```scala
assert(fizzBuzz(3) === "Fizz")
```

## その他の書き方紹介

上記の FlatSpec の他にも、ScalaTest には色々な書き方が用意されているので紹介します。

### FunSuite

`test` メソッドを使って書いていきます。 

```scala
import Main.fizzBuzz
import org.scalatest.matchers.should
import org.scalatest.funsuite.AnyFunSuite

class FizzBuzzFunSuite extends AnyFunSuite with should.Matchers {
  test("Return Fizz if Multiple of 3") {
    fizzBuzz(3) should be ("Fizz")
    fizzBuzz(99) should be ("Fizz")
  }
}
```

### FunSpec

`describe` や、`it` を使用してテストを書くことができます。

```scala
import Main.fizzBuzz
import org.scalatest.matchers.should
import org.scalatest.funspec.AnyFunSpec

class FizzBuzzFunSpec extends AnyFunSpec with should.Matchers {
  describe("FizzBuzz") {
    it ("should Return Fizz if Multiple of 3") {
      fizzBuzz(3) should be ("Fizz")
      fizzBuzz(99) should be ("Fizz")
    }
  }
}
```

### FeatureSpec

こちらは、シナリオテストを書くのに向いているものです。

例えば、1 ~ 10 のリストを用意して、FizzBuzz 計算を行った後のリストを検証するようなテストは以下のように書けます。

```scala
import Main.fizzBuzz
import org.scalatest.matchers.should
import org.scalatest.featurespec.AnyFeatureSpec
import org.scalatest.GivenWhenThen

class FizzBuzzFeatureSpec extends AnyFeatureSpec with GivenWhenThen with should.Matchers {
  Feature("FizzBuzz") {
    Scenario("should Return Fizz if Multiple of 3") {
      Given("an 1 to 10 list")
      val list = 1 to 10

      When("convert fizzBuzz Text list")
      val result = list.map(fizzBuzz).toList

      Then("the result is correct")
      result should equal (List("1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz"))
    }
  }
}
```

こちらは、Unit テストに使うこともできますが基本的にはシナリオテスト向けと言えると思います。

---

他にも何種類かテストの書き方はありますがここでは割愛します。
気になる方は、`import org.scalatest.` 以下を覗いてみると色々用意されているのを確認できます。

## まとめ

今回は、Scala で Test を各方法についてまとめました。
いくつか書き方を紹介しましたが、自然言語に近い FlatSpec でかくのが個人的にはしっくりきたので積極的に使っていこうかなと思います。



