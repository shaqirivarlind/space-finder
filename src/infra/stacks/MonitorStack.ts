import {Duration, Stack, StackProps} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import {Alarm, Unit, Metric} from 'aws-cdk-lib/aws-cloudwatch'
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Topic} from 'aws-cdk-lib/aws-sns'
import {LambdaSubscription} from 'aws-cdk-lib/aws-sns-subscriptions'
import {SnsAction} from 'aws-cdk-lib/aws-cloudwatch-actions'

export class MonitorStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // aws cloudwatch describe-alarms

    const webHookLambda = new NodejsFunction(this, 'webHookLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', 'services', 'monitor', 'handler.ts'),
    })

    const alarmTopic = new Topic(this, 'spacesAlarmTopic', {
      displayName: 'AlarmTopic',
      topicName: 'AlarmTopic',
    })
    alarmTopic.addSubscription(new LambdaSubscription(webHookLambda))

    const spacesApi4xxAlarm = new Alarm(this, 'SpacesApi4xxAlarm', {
      metric: new Metric({
        metricName: '4XXError',
        namespace: 'AWS/ApiGateway',
        period: Duration.minutes(1),
        statistic: 'Sum',
        unit: Unit.COUNT,
        dimensionsMap: {
          "ApiName": "SpacesApi"
        }
      }),
      evaluationPeriods: 1,
      threshold: 5,
      alarmName: 'SpacesApi4xxAlarm',
    })

    const topicAction = new SnsAction(alarmTopic)
    spacesApi4xxAlarm.addAlarmAction(topicAction)
    spacesApi4xxAlarm.addOkAction(topicAction)
  }
}