+++
title="Pydantic model_validator について"
date="2025-08-03T23:27:30+09:00"
categories = ["engineering"]
tags = ["python"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Pydanticの`model_validator`について、簡単にまとめておきます。

## model_validatorとは

Pydanticの `model_validator`は、モデル全体に対してバリデーションを行うためのデコレータです。個別のフィールドではなく、複数フィールド間の関係性や、モデル全体の整合性をチェックする際に使用します。

## 基本的な2つのモード

### afterモード

モデル作成後にバリデーションを実行。既にバリデーション済みのインスタンスを操作できるため、型安全で使いやすいのが特徴です。

### beforeモード

モデル作成前の生データに対してバリデーションを実行。データの前処理や正規化に適しています。

## 実用例：パスワード確認

```python
from typing_extensions import Self
from pydantic import BaseModel, ValidationError, model_validator

class UserRegistration(BaseModel):
    username: str
    password: str
    password_confirm: str

    @model_validator(mode='after')
    def check_passwords_match(self) -> Self:
        if self.password != self.password_confirm:
            raise ValueError('パスワードが一致しません')
        return self

# 使用例
try:
    user = UserRegistration(
        username="test",
        password="secret123", 
        password_confirm="secret456"
    )
except ValidationError as e:
    print(e)  # パスワードが一致しません
```

## いつ使うべきか

例えばこんな処理で使えそうというユースケースをあげてみます。

- パスワードと確認用パスワードの一致チェック
- 開始日と終了日の順序確認
- 複数フィールドの組み合わせによる制約
- 条件付きでフィールドが必須になる場合

`field_validator`では対応できない、フィールド間の関係性をチェックする場面で威力を発揮します。
