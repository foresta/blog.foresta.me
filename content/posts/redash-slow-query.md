+++
title="redash のスロークエリを特定する"
date="2025-06-01T23:39:56+09:00"
categories = ["engineering"]
tags = ["redash", "slowquery", "monitoring"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

Redash で重いクエリを特定するためのクエリについて紹介します。

## slow query の特定

今回は Snowflake のコストをモニタリングする過程で、Redash のクエリ実行が重いことがわかったので特に思いクエリを特定するためのクエリを作成しました。

以下に SQL を記載します。

```sql
with
query_stats as (
  select
    query_hash
    , round(cast(avg(runtime) as numeric), 2) as avg_runtime -- 平均実行時間
    , max(retrieved_at) as last_executed
    , count(1) as run_count --実行回数
    , sum(CASE WHEN retrieved_at >= CURRENT_TIMESTAMP - INTERVAL '10 days' THEN 1 else 0 END) as last_10days_run_count -- 直近10日実行回数
  from
    query_results
  where
    retrieved_at between '{{ date.start }}' and '{{ date.end }}' -- 期間指定
    and
    data_source_id in (
        select
            id
        from data_sources
        where type = 'snowflake'
    )
  group by
    query_hash
)
select
  q.id
  , q.name
  , st.avg_runtime
  , st.run_count
  , last_10days_run_count
  , st.avg_runtime * last_10days_run_count as score
  , last_executed
from queries q
join query_stats st using (query_hash)
where
  not q.is_archived
order by
  score desc
limit 100;
```

このクエリでは、直近 10 日の実行回数と平均実行時間を元にスコアを計算し、重いクエリを特定しています。

Redash 管理用の Postgresql DB に query_results テーブルがあり、こちらに各クエリの実行結果や処理時間があるため、こちらのテーブルを操作することで時間がかかっているクエリを特定することができます。

## まとめ

Redash のクエリ実行時間をモニタリングすることで、重いクエリを特定し、改善のためのアクションを取ることができます。
Redash の管理用のテーブルを用いれば様々な情報を取ることができるため便利です。重いクエリが叩かれ続けないように継続的に確認しようと思いました。

