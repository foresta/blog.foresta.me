+++
title="Python の Enum の使い方"
date="2025-04-11T20:54:49+09:00"
categories = ["engineering"]
tags = ["python", "enum"]
thumbnail = ""
+++


こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は Python での Enum の使い方についてメモをします。

## はじめに
プログラミングにおいて、関連する定数をグループ化して扱いたいケースは頻繁に発生します。Python 3.4 から標準ライブラリに追加された Enum クラスは、こうした用途に最適なソリューションを提供します。この記事では、Python の Enum の基本から応用、さらには StrEnum や IntEnum などの派生クラスまで、実用的な例を交えて解説します。

### 目次
- Enum とは
- 基本的な使い方
- Enum のメソッドとプロパティ
- IntEnum - 整数との互換性
- StrEnum - 文字列との互換性
- Flag と IntFlag - ビット演算のサポート
- auto() 関数の活用
- Enum のカスタマイズ
- 実践的なユースケース
- パフォーマンスと注意点
- まとめ

## 1. Enum とは
Enum（列挙型）は、名前付きの定数値のセットを定義するためのクラスです。Python における Enum は、関連する値のグループを表現し、タイプセーフな方法でそれらの値を扱うことができます。

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
```

Enum を使用することの主な利点は：

関連するシンボルをグループ化できる
コードの可読性と保守性が向上する
タイプセーフティ（型安全性）の確保
入力値の検証が容易になる

## 2. 基本的な使い方
Enum の定義

```python
from enum import Enum

class Season(Enum):
    SPRING = 1
    SUMMER = 2
    AUTUMN = 3
    WINTER = 4
```

Enum の使用例

```
# 値の取得
print(Season.SUMMER)        # Season.SUMMER
print(Season.SUMMER.name)   # 'SUMMER'
print(Season.SUMMER.value)  # 2

# 値からの逆引き
print(Season(1))            # Season.SPRING

# メンバーの比較
print(Season.SPRING == Season.SPRING)  # True
print(Season.SPRING == Season.SUMMER)  # False

# イテレーション
for season in Season:
    print(season)
```

実行結果：

```
Season.SUMMER
SUMMER
2
Season.SPRING
True
False
Season.SPRING
Season.SUMMER
Season.AUTUMN
Season.WINTER
```

## 3. Enum のメソッドとプロパティ
Enum クラスには、利用可能な様々なメソッドとプロパティがあります：

主なプロパティ
- name: Enumメンバーの名前を返す
- value: Enumメンバーの値を返す

主なメソッド

```python
# すべてのメンバーを取得
print(list(Season))  # [Season.SPRING, Season.SUMMER, Season.AUTUMN, Season.WINTER]

# 名前から取得
print(Season['WINTER'])  # Season.WINTER

# __members__ 属性で全メンバーの辞書を取得
print(Season.__members__)  
# {'SPRING': Season.SPRING, 'SUMMER': Season.SUMMER, 'AUTUMN': Season.AUTUMN, 'WINTER': Season.WINTER}
```

## 4. IntEnum - 整数との互換性
IntEnum は Enum の派生クラスで、整数型との互換性を持っています。通常の Enum では整数との比較はできませんが、IntEnum ではこれが可能です。

```python
from enum import IntEnum

class Size(IntEnum):
    SMALL = 1
    MEDIUM = 2
    LARGE = 3
    EXTRA_LARGE = 4

# 整数との比較が可能
print(Size.MEDIUM == 2)  # True
print(Size.LARGE > Size.SMALL)  # True
print(Size.SMALL + 10)  # 11

# ソートも可能
sizes = [Size.LARGE, Size.SMALL, Size.MEDIUM]
print(sorted(sizes))  # [Size.SMALL, Size.MEDIUM, Size.LARGE]
```

通常の Enum では整数との比較はエラーになります：

```python
from enum import Enum

class RegularSize(Enum):
    SMALL = 1
    MEDIUM = 2
    LARGE = 3

# これはエラーになる
# print(RegularSize.MEDIUM == 2)  # TypeError
```

## 5. StrEnum - 文字列との互換性
Python 3.11 から、StrEnum が追加されました。これは str との互換性を持つ Enum クラスです。

```python
from enum import StrEnum

class Status(StrEnum):
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'

# 文字列との比較が可能
print(Status.APPROVED == 'approved')  # True

# 文字列メソッドも使える
print(Status.APPROVED.upper())  # 'APPROVED'
print(Status.REJECTED.startswith('rej'))  # True

# JSONシリアライズも簡単
import json
data = {'status': Status.PENDING}
json_data = json.dumps(data)
print(json_data)  # {"status": "pending"}
```

Python 3.11 より前のバージョンでは、自分で StrEnum を実装する必要があります：

```
from enum import Enum

class StrEnum(str, Enum):
    def __str__(self):
        return self.value

    def __repr__(self):
        return self.value
```

## 6. Flag と IntFlag - ビット演算のサポート
Flag と IntFlag は、ビットフラグとしてEnumを使用するためのクラスです。複数の値の組み合わせを表現できます。

```python
from enum import Flag, auto

class Permission(Flag):
    READ = auto()       # 1
    WRITE = auto()      # 2
    EXECUTE = auto()    # 4
    ADMIN = READ | WRITE | EXECUTE

# 複合フラグの作成
user_permission = Permission.READ | Permission.WRITE

# メンバーシップテスト
print(Permission.READ in user_permission)  # True
print(Permission.EXECUTE in user_permission)  # False

# 新しいフラグの作成
full_permissions = user_permission | Permission.EXECUTE
print(full_permissions)  # Permission.ADMIN
```

IntFlag は Flag と似ていますが、int との互換性もあります：

```python
from enum import IntFlag, auto

class Mode(IntFlag):
    READ = auto()      # 1
    WRITE = auto()     # 2
    EXECUTE = auto()   # 4
    
    @classmethod
    def all(cls):
        return cls.READ | cls.WRITE | cls.EXECUTE

# 整数との演算
print(Mode.READ | 4)  # Mode.READ|EXECUTE (5)
```

## 7. auto() 関数の活用
auto() 関数を使うと、Enumの値を自動的に割り当てることができます：

```python
from enum import Enum, auto

class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()

print(Color.RED.value)    # 1
print(Color.GREEN.value)  # 2
print(Color.BLUE.value)   # 3
```

`_generate_next_value_` メソッドをオーバーライドすることで、自動生成値のロジックをカスタマイズできます：

```python
from enum import Enum, auto

class PowerOf2(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return 2 ** count
    
    A = auto()  # 1
    B = auto()  # 2
    C = auto()  # 4
    D = auto()  # 8

print(PowerOf2.A.value)  # 1
print(PowerOf2.B.value)  # 2
print(PowerOf2.C.value)  # 4
print(PowerOf2.D.value)  # 8
```

## 8. Enum のカスタマイズ

### 機能拡張
メソッドを追加して、Enumクラスを拡張できます：

```python
from enum import Enum

class Planet(Enum):
    MERCURY = (3.303e+23, 2.4397e6)
    VENUS   = (4.869e+24, 6.0518e6)
    EARTH   = (5.976e+24, 6.37814e6)
    MARS    = (6.421e+23, 3.3972e6)
    
    def __init__(self, mass, radius):
        self.mass = mass       # キログラム
        self.radius = radius   # メートル
        
    @property
    def surface_gravity(self):
        # 重力定数 G
        G = 6.67300E-11
        return G * self.mass / (self.radius * self.radius)

print(Planet.EARTH.surface_gravity)  # 9.802652743337129
```

### ユニークな値の強制
@unique デコレータを使用すると、重複する値を持つEnumの定義を防ぐことができます：

```python
from enum import Enum, unique

@unique
class Status(Enum):
    PENDING = 1
    APPROVED = 2
    REJECTED = 3
    # DUPLICATE = 1  # これはエラーになる
```

## 9. 実践的なユースケース
### APIステータスコード

```python
from enum import IntEnum

class HttpStatus(IntEnum):
    OK = 200
    CREATED = 201
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    SERVER_ERROR = 500
    
    @classmethod
    def is_success(cls, code):
        return 200 <= code < 300
    
    @classmethod
    def is_client_error(cls, code):
        return 400 <= code < 500
    
    @classmethod
    def is_server_error(cls, code):
        return code >= 500

# 使用例
response_code = HttpStatus.NOT_FOUND
print(f"Status code: {response_code}, Success: {HttpStatus.is_success(response_code)}")
```

### 設定オプション

```python
from enum import Enum, auto

class LogLevel(Enum):
    DEBUG = auto()
    INFO = auto()
    WARNING = auto()
    ERROR = auto()
    CRITICAL = auto()
    
    def __ge__(self, other):
        if self.__class__ is other.__class__:
            return self.value >= other.value
        return NotImplemented

class Config:
    def __init__(self, log_level=LogLevel.INFO):
        self.log_level = log_level
    
    def should_log(self, level):
        return level >= self.log_level

# 使用例
config = Config(LogLevel.WARNING)
print(config.should_log(LogLevel.ERROR))    # True
print(config.should_log(LogLevel.INFO))     # False
```

## 10. パフォーマンスと注意点
パフォーマンス
Enumはシングルトンパターンを実装しているため、メモリ効率が良く、比較操作も高速です。

```python
import timeit

def enum_comparison():
    return Season.SPRING == Season.SPRING

def string_comparison():
    return "SPRING" == "SPRING"

# パフォーマンス比較
enum_time = timeit.timeit(enum_comparison, number=1000000)
string_time = timeit.timeit(string_comparison, number=1000000)

print(f"Enum comparison: {enum_time}")
print(f"String comparison: {string_time}")
```

注意点
1. イミュータブル: Enumのインスタンスは不変です
2. サブクラス化の制限: 既存のEnum型からの継承には制限があります
3. メモリ使用: 多数のメンバーがある場合、メモリ使用量に注意が必要です
4. PickleとJSON: 標準のシリアライゼーションには特別な対応が必要です

```python
# JSONシリアライズの例
import json
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

# カスタムJSONエンコーダ
class EnumEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Enum):
            return {"__enum__": str(obj.name)}
        return json.JSONEncoder.default(self, obj)

# 使用例
color_data = {"favorite_color": Color.BLUE}
json_str = json.dumps(color_data, cls=EnumEncoder)
print(json_str)  # {"favorite_color": {"__enum__": "BLUE"}}
```

## 11. まとめ
Python の Enum は、関連する定数値をグループ化し、タイプセーフに扱うための強力なツールです。基本的な Enum から IntEnum、StrEnum、Flag などの特殊なバリエーションまで、さまざまなユースケースに適したクラスが提供されています。特に：

- Enum: 基本的な列挙型で、名前付き定数のコレクションを作成する
- IntEnum: 整数との互換性を持つ列挙型
- StrEnum: 文字列との互換性を持つ列挙型（Python 3.11 から）
- Flag/IntFlag: ビット演算をサポートする列挙型

適切な Enum クラスを選択し、プロジェクトに合わせてカスタマイズすることで、より保守性が高く、バグの少ないコードを書くことができます。Enum は設定値、ステータスコード、許可フラグなど、多くの実用的なシナリオで活躍します。

### 参考リソース

- {{< exlink href="https://docs.python.org/3/library/enum.html" text="Python 公式ドキュメント - enum" >}}
- {{< exlink href="https://realpython.com/python-enums/" text="Real Python - Python Enums" >}}
- {{< exlink href="https://peps.python.org/pep-0435/" text="PEP 435 – Adding an Enum type to the Python standard library" >}}

