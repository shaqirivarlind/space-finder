import {App} from 'aws-cdk-lib'
import {MonitorStack} from '../../src/infra/stacks/MonitorStack'
import {Capture, Match, Template} from 'aws-cdk-lib/assertions'


describe('initial test suite', () => {
  let monitorStackTemplate: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: 'cdk.out'
    })
    const monitorStack = new MonitorStack(testApp, 'MonitorStack')
    monitorStackTemplate = Template.fromStack(monitorStack)
  })

    test('Lambda properties', () => {
      // arrange step
      // act step
      // assert step
      // expect(true).toBeTruthy() // first dummy test


      // const testApp = new App({
      //   outdir: 'cdk.out'
      // })
      // const monitorStack = new MonitorStack(testApp, 'MonitorStack')
      // const monitorStackTemplate = Template.fromStack(monitorStack)

      monitorStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
      })
    });

    test('Sns topic properties', () => {

      // const testApp = new App({
      //   outdir: 'cdk.out'
      // })
      // const monitorStack = new MonitorStack(testApp, 'MonitorStack')
      // const monitorStackTemplate = Template.fromStack(monitorStack)

      monitorStackTemplate.hasResourceProperties('AWS::SNS::Topic', {
        DisplayName: "AlarmTopic",
        TopicName: "AlarmTopic"
      })
    });

    test('Sns subscriptions properties - with matchers', () => {
      monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription',
        Match.objectEquals({
          Protocol: "lambda",
          TopicArn: {
            Ref: Match.stringLikeRegexp('AlarmTopic')
          },
          Endpoint: {
            "Fn::GetAtt": [
              Match.stringLikeRegexp('webHookLambda'),
              "Arn"
            ]
          }
        })
      )
    });

    test('Sns subscriptions properties - with exact values', () => {
      const snsTopic = monitorStackTemplate.findResources('AWS::SNS::Topic');
      const snsTopicName = Object.keys(snsTopic)[0];

      const snsSubscription = monitorStackTemplate.findResources('AWS::SNS::Subscription');
      const snsSubscriptionName = Object.keys(snsSubscription)[0];

      const lambda = monitorStackTemplate.findResources('AWS::Lambda::Function');
      const lambdaName = Object.keys(lambda)[0];

      monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription',
        {
          Protocol: "lambda",
          TopicArn: {
            Ref: snsTopicName
          },
          Endpoint: {
            "Fn::GetAtt": [
              lambdaName,
              "Arn"
            ]
          }
        }
      )
    });

    test('Alarm actions', () => {
      const alarmActionsCaption = new Capture()

        monitorStackTemplate.hasResourceProperties('AWS::CloudWatch::Alarm', {
            AlarmActions: alarmActionsCaption
        });

        expect(alarmActionsCaption.asArray()).toEqual([{
            Ref: expect.stringMatching(/^spacesAlarmTopic/)
        }]);
    });

    test('MonitorStack snapshot', () => {
      expect(monitorStackTemplate.toJSON()).toMatchSnapshot();
    });

    test('Lambda stack snapshot', () => {
      const lambda = monitorStackTemplate.findResources('AWS::Lambda::Function');

      expect(lambda).toMatchSnapshot();
    });

    test('SnsTopic snapshot', () => {
      const snsTopic = monitorStackTemplate.findResources('AWS::SNS::Topic');

      expect(snsTopic).toMatchSnapshot();
    });
})