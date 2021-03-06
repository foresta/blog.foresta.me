+++
title="Apache Benchmark で負荷テストをする"
date="2021-03-06T14:25:50+09:00"
categories = ["engineering"]
tags = ["cli", "test", "load-test", "apache-benchmark"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は，Apache Benchmark を用いて負荷テストをしたのでその方法についてまとめます．

## 負荷をかけてみる

Apache Benchmark を用いると比較的簡単にWebサービスなどに対して負荷をかけることができます．

よく使うオプションとして，`-c` と `-n` と `-t` があります．

`-c`: 並列数を指定できます\
`-n`: リクエスト数を指定できます\
`-t`: 負荷をかける秒数を指定できます

以下にコマンドの例と，実行結果の例を載せます．

```bash
# 10 並列で，10秒間 負荷を与える
$ ab -c 10 -t 10 http://localhost:1313/
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)


Server Software:        
Server Hostname:        localhost
Server Port:            1313

Document Path:          /
Document Length:        58811 bytes

Concurrency Level:      10
Time taken for tests:   2.843 seconds
Complete requests:      50000
Failed requests:        0
Total transferred:      2949900000 bytes
HTML transferred:       2940550000 bytes
Requests per second:    17587.52 [#/sec] (mean)
Time per request:       0.569 [ms] (mean)
Time per request:       0.057 [ms] (mean, across all concurrent requests)
Transfer rate:          1013309.08 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       1
Processing:     0    0   0.3      0      24
Waiting:        0    0   0.2      0      11
Total:          0    1   0.3      1      24

Percentage of the requests served within a certain time (ms)
  50%      1
  66%      1
  75%      1
  80%      1
  90%      1
  95%      1
  98%      1
  99%      1
 100%     24 (longest request)
```


```bash
# 10 並列で，100リクエストの負荷を与える
$ ab -c 10 -n 100 http://localhost:8080/
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient).....done


Server Software:        
Server Hostname:        localhost
Server Port:            1313

Document Path:          /
Document Length:        59002 bytes

Concurrency Level:      10
Time taken for tests:   0.006 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      5918900 bytes
HTML transferred:       5900200 bytes
Requests per second:    17892.29 [#/sec] (mean)
Time per request:       0.559 [ms] (mean)
Time per request:       0.056 [ms] (mean, across all concurrent requests)
Transfer rate:          1034205.72 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       0
Processing:     0    0   0.1      0       1
Waiting:        0    0   0.1      0       0
Total:          0    1   0.1      0       1
ERROR: The median and mean for the total time are more than twice the standard
       deviation apart. These results are NOT reliable.

Percentage of the requests served within a certain time (ms)
  50%      0
  66%      1
  75%      1
  80%      1
  90%      1
  95%      1
  98%      1
  99%      1
 100%      1 (longest request)
```


## ファイルディスクリプタの上限を増やす


以下のように並列数が大きすぎた場合に，`socket: Too many open files (24)` というエラーが表示されることがあります．


```bash
$ ab -c 1500 -t 5 http://localhost:1313/
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
socket: Too many open files (24)
```

これは，1 プロセスがリソースを食いつぶさないように，使えるファイルディスクリプタの上限が決まっているためです．
上限の数値は以下のコマンドで確認できます．

```bash
$ ulimit -n
1024
```

なので，1500 の同時リクエストなどを付加検証したい場合には，以下のようにして上限を設定し直すと実行することが出来ます．

```bash
$ ulimit -n 2000

$ ab -c 1500 -t 1 http://localhost:1313/
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Finished 3946 requests


Server Software:
Server Hostname:        localhost
Server Port:            1313

Document Path:          /
Document Length:        59276 bytes

Concurrency Level:      1500
Time taken for tests:   1.001 seconds
Complete requests:      3946
Failed requests:        0
Total transferred:      234839867 bytes
HTML transferred:       234101217 bytes
Requests per second:    3941.73 [#/sec] (mean)
Time per request:       380.544 [ms] (mean)
Time per request:       0.254 [ms] (mean, across all concurrent requests)
Transfer rate:          229087.48 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    3   7.3      0      32
Processing:    12  125  78.0     97     949
Waiting:       12  124  78.2     97     949
Total:         36  128  82.5     98     981

Percentage of the requests served within a certain time (ms)
  50%     98
  66%    119
  75%    145
  80%    163
  90%    236
  95%    296
  98%    335
  99%    351
 100%    981 (longest request)
```

なお，ここで設定した，`ulimit -n` の値は，Terminal のセッションごとになるため，Terminal を起動し直すともとに戻ります．

## Cookie をつけて負荷をかける

Cookie の値をつけることも可能です．

以下のように，`-C` フラグのあとに，`key=value;` の形式で複数記載することが出来ます．

```bash
$ ab -c 50 -t 10 -C "key=value; hoge=fuga" http://localhost:1313/
```

## まとめ

負荷検証などをする際に使える，Apache Benchmark (ab) コマンドと，そのオプションについて簡単にまとめました．

jMeter など他の負荷検証ツールもありますが，手軽に使う分には，この Apache Benchmark は非常に簡単で良いと思います．


### 参考

- {{< exlink href="https://httpd.apache.org/docs/2.4/programs/ab.html">}}
