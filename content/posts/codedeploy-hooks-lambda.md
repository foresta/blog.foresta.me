+++
title="AWS CodeDeploy の hooks から lambda を実行する"
date="2021-08-01T22:55:56+09:00"
categories = ["engineering"]
tags = ["aws", "codedeploy", "labmda"]
thumbnail = ""
+++

こんにちは、{{< exlink href="https://twitter.com/kz_morita" text="@kz_morita" >}}です。

今回は、AWS の CodeDeploy の hooks から lambda を実行してみたのでそれについてまとめます。

## モチベーション

ECSを使って動かしているサービスのデプロイに CodePipeline と CodeDeploy を使っていて, Blue/Green デプロイをしていました。
Blue/Green で本番のタスクセットを切り替えた後に、CloudFront の キャッシュを消したいと思い、CodeDeploy や CodePipeline のドキュメントを調べていたら、CodeDeploy の hooks が使えそうだなということがわかり設定を行いました。

## CodeDeploy の hooks について

CodeDeploy には、処理の hook を設定できるようになっており、いくつかのタイミングを指定して任意の処理を実行できます。

タイミングは以下のような感じです。

- BeforeInstall
- Install
- AfterInstall
- AllowTestTraffic
- AfterAllowTestTraffic
- BeforeAllowTraffic
- AllowTraffic
- AfterAllowTraffic


Install、AllowTestTraffic、AllowTraffic はhooks を指定できないです。

ざっくりと説明すると、
- Install が 置き換えタスクセットの作成
- AllowTestTraffic がテスト用にトラフィックの切り替え
- AllowTraffic がトラフィックの切り替え

となると思います。それぞれの前後などに任意の処理が挟めることになります。

hooks で実行できるのは、アプリケーションのソースコードリポジトリに含まれる実行可能ファイルか、lambda Function になります。

今回は、lambda function を実行できれば良いのでこちらについてみていきます。

参考: {{< exlink href="https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html" >}}


## lambda を hooks に設定

lambda を hooks に設定するには、appspec.yml に対して lambda の ARN を指定する必要があります。

appspec.yml の指定例を以下に示します。

```yml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: <TASK_DEFINITION>
        LoadBalancerInfo:
          ContainerName: "NginxContainer"
          ContainerPort: 80
Hooks:
  - AfterAllowTraffic: "arn:aws:lambda:ap-northeast-1:{account_id}:function:{lambda_function_name}"
```

当初の目的で言うと、Traffic を切り替えた後に CloudFront のキャッシュを Invalidate したかったので、AfterAllowTraffic のイベントを指定しました。

呼び出される lambda 側のコード例を以下に載せます。


```python
import boto3
import os
import time

codedeploy = boto3.client('codedeploy')
cloudfront = boto3.client('cloudfront')

def create_invalidation(distribution_id):
    """
    CloudFront の Invalidation を作成
    """
    res = cloudfront.create_invalidation(
        DistributionId=distribution_id,
        InvalidationBatch={
        'Paths': {
            'Quantity': 1,
            'Items': ['/*'],
        },
        'CallerReference': str(time.time())
        }
    )
    invalidation_id = res['Invalidation']['Id']
    return invalidation_id


def lambda_handler(event, context):
    try:
        distributionId = os.environ['DistributionId']
        invalidation_id = create_invalidation(distributionId)
    except Exception as err:
    
    if ("DeploymentId" in event and "LifecycleEventHookExecutionId" in event):
        status = 'Succeeded'
        codedeploy.put_lifecycle_event_hook_execution_status(
            deploymentId=event["DeploymentId"],
            lifecycleEventHookExecutionId=event["LifecycleEventHookExecutionId"],
            status=status
        )

    return "Complete."
```

`create_invalidation` は、CloudFront の Invalidation を作成するコードになります。

CodeDeploy の hooks で lambda を実行する上で特殊なのが以下の部分のコードです。

```python
status = 'Succeeded'
codedeploy.put_lifecycle_event_hook_execution_status(
    deploymentId=event["DeploymentId"],
    lifecycleEventHookExecutionId=event["LifecycleEventHookExecutionId"],
    status=status
)
```

この部分で hooks から呼ばれた lambda の実行結果を、CodeDeploy 側に通知しないと Deploy 自体がエラーになってしまいます。
正確には、CodeDeploy はこの実行結果の通知を1時間待ち、それでも通知が来なければエラーとするようです。

また、上記のように lambda から CodeDeploy へ通知する必要があるため、lambda にもこのための IAM Role を指定する必要があります。

aws-cdk であれば以下のような形になるでしょう。

```typescript
    const invalidationTaskRolePolicy = new iam.ManagedPolicy(
      this,
      `TaskRolePolicy`,
      {
        managedPolicyName: `cloudfront-invalidation-policy`,
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'cloudfront:CreateInvalidation',
              'cloudfront:GetInvalidation',
            ],
            resources: [
              cloudfrontArn
            ],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['codedeploy:PutLifecycleEventHookExecutionStatus'],
            resources: [deploymentGroup.deploymentGroupArn],
          }),
        ],
      }
    );
```

`codedeploy:PutLifecycleEventHookExecutionStatus` が上記の lambda から、CodeDeploy へ実行結果を通知するための、action 名になります。

## まとめ

今回は、CodeDeploy の hooks で lambda をよぶ方法についてまとめました。
設定自体は簡単であっさりできたのですが、当初は CodePipeline の 1ステージとしてキャッシュを消すことなども考えていたため調査に時間がかかってしまいました。

hooks は、ECS の CodeDeploy 意外にも、EC2 などでも使えるようなので同じようなことをしなければいけないときには、この辺りを調べてみるとやりたいことが実現できるのかなと思います。


