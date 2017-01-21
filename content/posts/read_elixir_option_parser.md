+++
title = "OptionParserのソースコードを読む"
date = "2016-06-05"
+++

この記事は[Elixir (その2)とPhoenix Advent Calendar 2016](http://qiita.com/advent-calendar/2016/elixir2_and_phoenix) の1９日目の記事です。

# 背景

書籍「プログラミングElixir」の13章でお世話になったOptionParserがとても便利そうだったので、中身の理解とElixirのソースコードに慣れる目的で、ソースコードを読んでみました。
メインであるparse/2を中心に説明します。

下記に記載するソースコードは全て、公式のものを引用しています。

# 環境
Elixir 1.3.3  
[ドキュメント](https://hexdocs.pm/elixir/1.3.3/OptionParser.html)  
[ソースコード](https://github.com/elixir-lang/elixir/blob/v1.3.3/lilb/elixir/lib/option_parser.ex)  


## おおまかな流れ

1. parse/2 　　　(外部に公開するインターフェース)
2. `do_parse/6`　（実際にパースの再帰処理を行っているところ）
3. next/4 　　　　(パース処理)

# ソースコード

## parse/2

まずはメインのparse/2です。

### parse/2
```ex
@spec parse(argv, options) :: {parsed, argv, errors}
def parse(argv, opts \\ []) when is_list(argv) and is_list(opts) do
  do_parse(argv, compile_config(opts), [], [], [], true)
end
```

引数のoptsを`comple_config/1`を通して加工して`do_parse`に渡しています。
また、`do_parse/6`の結果をそのまま返しています。

### `compile_config/1`
```ex

defp compile_config(opts) do
  aliases = opts[:aliases] || []

  {switches, strict} = cond do
    opts[:switches] && opts[:strict] ->
      raise ArgumentError, ":switches and :strict cannot be given together"
    s = opts[:switches] ->
      {s, false}
    s = opts[:strict] ->
      {s, true}
    true ->
      {[], false}
  jend

  {aliases, switches, strict}
end
```

設定には、`:aliases`, `:switches`, `:strict`が使用できそうです。
そして、`:switches`と`:strict`が同時には使用できないみたいです。
それぞれの設定がどのように動作するかは後ほど。

## `do_parse/6`
```ex

defp do_parse([], _config, opts, args, invalid, _all?) do
{Enum.reverse(opts), Enum.reverse(args), Enum.reverse(invalid)}
end

defp do_parse(argv, {aliases, switches, strict}=config, opts, args, invalid, all?) do
case next(argv, aliases, switches, strict) do
{:ok, option, value, rest} ->
# the option exists and it was successfully parsed
kinds = List.wrap Keyword.get(switches, option)
new_opts = do_store_option(opts, option, value, kinds)
do_parse(rest, config, new_opts, args, invalid, all?)

{:invalid, option, value, rest} ->
# the option exist but it has wrong value
do_parse(rest, config, opts, args, [{option, value} | invalid], all?)

{:undefined, option, _value, rest} ->
# the option does not exist (for strict cases)
do_parse(rest, config, opts, args, [{option, nil} | invalid], all?)

{:error, ["--" | rest]} ->
{Enum.reverse(opts), Enum.reverse(args, rest), Enum.reverse(invalid)}

{:error, [arg | rest] = remaining_args} ->
# there is no option
if all? do
do_parse(rest, config, opts, [arg | args], invalid, all?)
else
{Enum.reverse(opts), Enum.reverse(args, remaining_args), Enum.reverse(invalid)}
end
end
end
```

引数は以下の通りになっています。

|引数|意味|
|:----- | :-------------- |
|argv   | 入力
|config | `compile_flag/1`を通して生成された設定（:aliases, :switches, :strict）
|opts   |パースした結果得られたオプション
|args   |パースに成功した引数
|invalid|パースに失敗した引数
|all?   |bool値。parse/2ならばtrue, `parse_head/2`ならばfalse

上に書いてある方の`do_parse/6`が再帰処理の終了条件です。
argvが空の場合に再起終了とし、opts, args, invalidをそれぞれEnum.reverseしてからタプルとして返しています。
ここでEnum.reverseしているのは、下に記述してある`do_parse/6`でパース結果をリストのheadとして再帰的に処理しているためです。

下に書いてあるのがメインの再帰処理です。
この中では、next/4で実際のパース処理を行いそのパース結果をリストに追加して、再帰処理を実行しています。

next/４に期待する戻り値は、タプルです。
先頭の項には以下の４つのアトムが設定されているようです。

* :ok
* :invalid
* :undefined
* :error

#### ：okが返ってきた場合

`do_store_option/4`でオプションを保存して、次の処理へ

```ex
{:ok, option, value, rest} ->
# the option exists and it was successfully parsed
kinds = List.wrap Keyword.get(switches, option)
new_opts = do_store_option(opts, option, value, kinds)
do_parse(rest, config, new_opts, args, invalid, all?)
```

:switchesには、:countと:keepが指定できます。
:countは複数回出てきたオプションの回数を数えていて、
:keepが指定されていると複数回指定されたオプションをすべて保持します。
それ以外であれば、重複を許さないため、Kerywordリストから削除しています。

### `do_store_option/4`
```ex
defp do_store_option(dict, option, value, kinds) do
cond do
:count in kinds ->
Keyword.update(dict, option, value, & &1 + 1)
:keep in kinds ->
[{option, value} | dict]
true ->
[{option, value} | Keyword.delete(dict, option)]
end
end
```

#### :invalidが返ってきた場合

invalidリストのheadにoptionとvalueのタプルを詰めて次の処理へ

```ex
{:invalid, option, value, rest} ->
# the option exist but it has wrong value
do_parse(rest, config, opts, args, [{option, value} | invalid], all?)
```

#### :undefinedが返ってきた場合

valueが定義されていないため、invalidリストのheadにoptionとnilのタプルを詰めて次の処理へ

```ex
{:undefined, option, _value, rest} ->
# the option does not exist (for strict cases)
do_parse(rest, config, opts, args, [{option, nil} | invalid], all?)
```

#### :errorが返ってきた場合

２パターンあって一つ目は、入力に「--」が単独で入っていた場合、その場合はそれ以降のパースをせずに
それまでパースしたオプションをそれぞれEnum.reverseして返し終了しています。

二つ目は、それ以外の不正な文字のケースで、その場合は、all?フラグがtrue(parse/2)の場合は続いてパースし、
それ以外の場合(`parse_head/2`)はそれまでパースしたオプションをそれぞれEnum.reverseして返し終了しています。

```ex
{:error, ["--" | rest]} ->
{Enum.reverse(opts), Enum.reverse(args, rest), Enum.reverse(invalid)}

{:error, [arg | rest] = remaining_args} ->
# there is no option
if all? do
do_parse(rest, config, opts, [arg | args], invalid, all?)
else
{Enum.reverse(opts), Enum.reverse(args, remaining_args), Enum.reverse(invalid)}
end
```

次はnext/4です。

## next/4

```ex
defp next([], _aliases, _switches, _strict) do
{:error, []}
end

defp next(["--" | _] = argv, _aliases, _switches, _strict) do
{:error, argv}
end

defp next(["-" | _] = argv, _aliases, _switches, _strict) do
{:error, argv}
end

defp next(["- " <> _ | _] = argv, _aliases, _switches, _strict) do
{:error, argv}
end

defp next(["-" <> option | rest] = argv, aliases, switches, strict) do
{option, value} = split_option(option)
original = "-" <> option
tagged = tag_option(option, switches, aliases)

cond do
negative_number?(original) ->
{:error, argv}
strict and not option_defined?(tagged, switches) ->
{:undefined, original, value, rest}
true ->
{option, kinds, value} = normalize_option(tagged, value, switches)
{value, kinds, rest} = normalize_value(value, kinds, rest, strict)
case validate_option(value, kinds) do
{:ok, new_value} -> {:ok, option, new_value, rest}
:invalid         -> {:invalid, original, value, rest}
end
end
end

defp next(argv, _aliases, _switches, _strict) do
{:error, argv}
end
```

パターンマッチで以下のように処理を分岐させています。

|num|条件| 返す値|
| :-- | :----------------- | :---------- |
| １ |argvが空リスト| {:error, []} |
| 2 |argvリストの先頭が"--"　　| {:error, argv}|
| 3 |argvリストの先頭が"-" | {:error, argv} 　　　　|
| 4 |argvリストの先頭が"- "から始まる文字列| {:error, argv} |
| 5 |argvリストの先頭が"-"から始まる文字列 |  パース処理結果 |
| 6 |その他| {:error, argv} |

上から５つ目のnext/4は実際にパース処理を行っているところです。
リストの先頭が"-"から始まる文字列であればパース処理を行います。

パース処理見ていきます。

まず、先頭で`split_option/1`を実行しています。
そして、optionの先頭に-をつけたものをoriginalとして保持しています。
引数のパターンマッチ時に、optionが「-」を除いたものになっているためです。

### next/4
```ex
{option, value} = split_option(option)
original = "-" <> option
```

`split_option`は、以下のように文字列を"="で分割して結果をタプルで返してるだけです
これは```option=value```の形でもパースができるようにするためです。

```ex
defp split_option(option) do
case :binary.split(option, "=") do
[h]    -> {h, nil}
[h, t] -> {h, t}
end
end
```

次にtag_option/3をしています。

```ex
tagged = tag_option(option, switches, aliases)
```

tag_option/3では、switchesの「--no-xx」オプションと, aliasesのハンドリングを行っています。
中を読むと、optionが「-no-」から始まる場合、「-」から始まる場合、それ以外で分岐しています。


-no-で始まりかつ、switchesに:booleanが定義されている場合はタグにnegatedつまり、否定とします。

### `tag_option/3`

```ex
defp tag_option("-no-" <> option, switches, _aliases) do
cond do
(negated = get_option(option)) && :boolean in List.wrap(switches[negated]) ->
{:negated, negated}
option = get_option("no-" <> option) ->
{:default, option}
true ->
:unknown
end
end
```

-で始まっている場合は通常のoptionのため:defaultで返します。

```ex
defp tag_option("-" <> option, _switches, _aliases) do
if option = get_option(option) do
{:default, option}
else
:unknown
end
end

```

それ以外の場合は、:aliasesに指定されていれば、それを返し、そうでなければ:unknownを返します。

```ex
defp tag_option(option, _switches, aliases) when is_binary(option) do
opt = get_option(option)
if alias = aliases[opt] do
{:default, alias}
else
:unknown
end
end
```

最後にnext/4の残りの部分です。

```ex
cond do
negative_number?(original) ->
{:error, argv}
strict and not option_defined?(tagged, switches) ->
{:undefined, original, value, rest}
true ->
{option, kinds, value} = normalize_option(tagged, value, switches)
{value, kinds, rest} = normalize_value(value, kinds, rest, strict)
case validate_option(value, kinds) do
{:ok, new_value} -> {:ok, option, new_value, rest}
:invalid         -> {:invalid, original, value, rest}
end
end
end
```

`negative_number?(original)` でoriginalが負数の場合はエラーとして返しています。
```strict and not option_defined?(tagged, switches)``` でオプションが定義されていない場合は:undefinedを返します。

それ以外の場合は、normalize_option/3, normalize_value/４をしたのち、
オプションの型チェック(validate_option/2)を経て、結果を返しています。

`normalize_option/3` はざっくり言うとList.wrapすることで正規化しています。

### normalize_option
```ex
defp normalize_option(:unknown, value, _switches) do
{nil, [:invalid], value}
end

defp normalize_option({:negated, option}, value, switches) do
if value do
{option, [:invalid], value}
else
{option, List.wrap(switches[option]), false}
end
end

defp normalize_option({:default, option}, value, switches) do
{option, List.wrap(switches[option]), value}
end
```

`normalize_value/4` はvalueがnilの場合に、:boolean, :countが指定されている時などのハンドリングを行っているようです。

### normalize_value/4
```ex
defp normalize_value(nil, kinds, t, strict) do
cond do
:boolean in kinds ->
{true, kinds, t}
:count in kinds ->
{1, kinds, t}
value_in_tail?(t) ->
[h | t] = t
{h, kinds, t}
kinds == [] and strict ->
{nil, kinds, t}
kinds == [] ->
{true, kinds, t}
true ->
{nil, [:invalid], t}
end
end

defp normalize_value(value, kinds, t, _) do
{value, kinds, t}
end

defp value_in_tail?(["-" | _]),        do: true
defp value_in_tail?(["- " <> _ | _]),  do: true
defp value_in_tail?(["-" <> arg | _]), do: negative_number?("-" <> arg)
defp value_in_tail?([]),               do: false
defp value_in_tail?(_),                do: true
```

以上で一通り、オプションをパースする処理まで読むことができました。


# まとめ

ながながと書きましたが、最終的に公式のソースコードを読むのが一番理解が早いかもしれません。

今回はElixirのコードに慣れるためソースリーディングをしましたが、非常に勉強になりました。
知っている構文が、実際にどのようなケースで使われるのかという知見を得られたのと、
どのような粒度のメソッドを定義していくのかという点がとても参考になりました。

公式のソースは読みやすく非常に勉強になったので、さらに色々と読み込んでみようかと思います。
