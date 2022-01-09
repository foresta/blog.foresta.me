+++
title="karate を用いた e2e テストで一度だけ行いたい setup 処理を実現する"
date="2022-01-09T18:57:10+09:00"
categories = ["engineering"]
tags = ["karate", "e2e", "test", "bdd"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、{{< exlink href="" text="Karate" >}} という BDD (振る舞い駆動) テストフレームワークを使って、テストを行う前に一度だけ行いたい Setup の処理の実現方法をまとめます。

## 先に結論

karate で １度だけ行いたい Setup 処理を行うには、`Background` と `callonce` を組み合わせます。

```
Feature: Sample Test

  Background:
    * start = function() { return karate.start({ mock: 'classpath:mock/api-server-mock.feature', port: 8080 }).port }
    * def port = callonce start
```

## karate とは

karate は、BDD が実現できるテストフレームワークになります。

以下のような形式でテストの振る舞いを記述することができます。


```
Feature: Sample Test
  
  Background:
    * def port = 8080 

  Scenario: API mock sample
    Given karate.start({ mock: 'classpath:mock/api-server-mock.feature', port: port })
    When url 'http://localhost:' + port
    And path 'health'
    When method get
    Then status 200
```

上記では、Mock サーバーを立ち上げて、`localhost:8080/health` へリクエストして、HTTP Status 200 が返ってくることを確認するテストになります。

## 1度だけ行う setup 処理の実現

上記の Mock サーバーを立ち上げるのような、テストを行う前に一度だけ実行したい処理を karate では `Background` と `callonce` を用いて実現します。

karate では、Background セクションに指定したものは、各テスト Scenario が実行される前に実行されます。
普通に、Mock サーバーを立ち上げる処理を書いただけでは、重複してサーバーを立ち上げることになり、ポート被りでエラーになってしまうため一度だけ実行する必要があります。

一度だけ実行する処理のために、karate では、`callonce` と言うキーワードが用意されています。

```
Feature: Sample Test

  Background:
    * start = function() { return karate.start({ mock: 'classpath:mock/api-server-mock.feature', port: 8080 }).port }
    * def port = callonce start
```

callonce を用いると指定した関数が一度だけ実行されるようになり、2 度目以降はキャッシュされた値が返されるようになります。

## hooks

karate にはその他にもいろいろなタイミングで処理が実行でき、それが {{< exlink href="https://karatelabs.github.io/karate/#hooks" text="公式サイトの Hooks セクション" >}} で紹介されています。

| 実行タイミング | 実現方法 |
| --- | --- |
| 全体で一度だけ | `karate.callSingle()` |
| 各 Scenario の前 | `Background` セクションに記述 |
| テスト実行前に一度だけ | `Background` セクションで `callonce` (この記事) |
| 各 Scenario の後 | `configure afterScenario` |
| Feature の後 | `configure afterFeature` |

詳細は {{< exlink href="https://karatelabs.github.io/karate/#hooks" text="公式サイト" >}} で確認してみてください。

## まとめ

今回は、BDD テストフレームワークである karate で 一度だけ実行したい Setup 処理の実現方法についてまとめました。

BDD テストは、API の振る舞いのテストなど色々な場面で使用できるので一度何かのフレームワークを触ってみると良さそうです。
