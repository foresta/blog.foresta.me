+++
date = "2017-06-27T13:01:18+09:00"
title = "Cocos2d-xで並列に通信をする"

categories = ["engineering"]
tags = ["cocos2d-x"]
+++

## 先に結論

シーケンシャルに通信するときは
```cpp
HttpClient::send(HttpRequest* request);
```

パラレルに通信するときは
```cpp
HttpClient::sendImmediate(HttpRequest* request)
```

を使用すれば良さそう。


## 背景
アプリケーションが画像などのアセットを取得するときに、1件ずつシーケンシャルにダウンロードするのではなく並列に通信したかった。

## 結論までの経緯

まず内部実装をみてみる。

それっぽいのがHttpClient::sendクラスだったのでその実装を見ていく。

```cpp
//Add a get task to queue
void HttpClient::send(HttpRequest* request)
{    
    if (false == lazyInitThreadSemphore()) 
    {
        return;
    }

    if (!request)
    {
        return;
    }

    request->retain();

    _requestQueueMutex.lock();
    _requestQueue.pushBack(request);
    _requestQueueMutex.unlock();

    // Notify thread start to work
    _sleepCondition.notify_one();
}
```

詳しくは見ないが、`_requestQueue`にリクエストを詰めているだけのようだ。

その`_requestQueue`はどこ使われているかというと

同じくHttpClientクラスのnetworkThread()で使用されていた。


```cpp
// Worker thread
void HttpClient::networkThread()
{   
    increaseThreadCount();
            
    while (true) 
    {
        HttpRequest *request;

        {
            std::lock_guard<std::mutex> lock(_requestQueueMutex);
            while (_requestQueue.empty())
            {
                _sleepCondition.wait(_requestQueueMutex);
            }
            request = _requestQueue.at(0); // ここでリクエストをとりだす。
            _requestQueue.erase(0);
        }

        if (request == _requestSentinel) {
            break;
        }

        HttpResponse *response = new (std::nothrow) HttpResponse(request);
        processResponse(response, _responseMessage); // ここで送信処理
     
        // ・・・省略
    }
    // ・・・省略   
}
```

processResponseが実際の送信処理ぽいのでさらに見ていく。

HttpClient-apple.mm

```cpp
// Process Response
void HttpClient::processResponse(HttpResponse* response, char* responseMessage)
{
    // ・・・省略 // ここで通信処理?  
    retValue = processTask(this,
                           request,
                           requestType,
                           response->getResponseData(),
                           &responseCode,
                           response->getResponseHeader(),
                           responseMessage);

    // ・・・省略
}
```

次はprocessTaskがそれっぽいのでさらに見ていく

```cpp
static int processTask(HttpClient* client, HttpRequest* request, NSString* requestType, void* stream, long* responseCode, void* headerStream, char* errorBuffer)
{
    // ・・・省略
    HttpAsynConnection *httpAsynConn = [[HttpAsynConnection new] autorelease];
    httpAsynConn.srcURL = urlstring;
    httpAsynConn.sslFile = nil;
                
    std::string sslCaFileName = client->getSSLVerification();
    if(!sslCaFileName.empty())
    {
        long len = sslCaFileName.length();
        long pos = sslCaFileName.rfind('.', len-1);
        
        httpAsynConn.sslFile = [NSString stringWithUTF8String:sslCaFileName.substr(0, pos).c_str()];
    }
    [httpAsynConn startRequest:nsrequest];
    
    while( httpAsynConn.finish != true) // ここでリクエスト完了を待ってる
    {
        [[NSRunLoop currentRunLoop] runMode:NSDefaultRunLoopMode beforeDate:[NSDate distantFuture]];
    }
    // ・・・省略
}
```

ここまででリクエスト完了を待機している場所が見つかりました。
asyncで投げて、finishフラグがtrueになるまでここで待機しているので、newtworkThreadの処理は進まないことがわかりました。

ここまでで
HttpClient::sendがシーケンシャルに処理をすることがわかりました。

ここで、HttpClientクラスを眺めてると
HttpClient::sendImmediateという見るからにそれっぽいクラスが見つかります。

```cpp
void HttpClient::sendImmediate(HttpRequest* request)
{
    if(!request)
    {
        return;
    }

    request->retain();
    // Create a HttpResponse object, the default setting is http access failed
    HttpResponse *response = new (std::nothrow) HttpResponse(request);

    auto t = std::thread(&HttpClient::networkThreadAlone, this, request, response);
    t.detach();
}

```

HttpClietn::networkThreadAloneというメソッドを別スレッドで実行してます。

そのnetworkThreadAloneの中身はというと、

```cpp
// Worker thread
void HttpClient::networkThreadAlone(HttpRequest* request, HttpResponse* response)
{
    increaseThreadCount();
            
    char responseMessage[RESPONSE_BUFFER_SIZE] = { 0 };
    processResponse(response, responseMessage);

    // ・・・省略
}
```

processResponseを呼び出していました。
こちらだと一回ごとに別スレッドで通信されるため並列でリクエストが飛んでいました。



## 所感
深く読んでいないため、リクエストごとにスレッドを作って投げるって大丈夫なのかっていうのは懸念点です。

あとは、Cocos2d-xは内部実装が読めるので、困った時もソースを読めばなんとなく読めるのは良い点だなぁと思いました。

