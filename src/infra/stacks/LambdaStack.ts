import {Duration, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
// import {Function as LambdaFunction, Runtime, Code} from "aws-cdk-lib/aws-lambda";
import {Runtime, Tracing} from "aws-cdk-lib/aws-lambda";
import {join} from "path";
import {LambdaIntegration} from "aws-cdk-lib/aws-apigateway";
import {ITable} from "aws-cdk-lib/aws-dynamodb";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable
}

export class LambdaStack extends Stack {
  // public helloLambdaIntegration: LambdaIntegration;
  public spacesLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    /*new LambdaFunction(this, 'HelloLambda', {
        runtime: Runtime.NODEJS_18_X,
        handler: 'hello.main',
        code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
    })*/
    /*const helloLambda = new LambdaFunction(this, 'HelloLambda', {
        runtime: Runtime.NODEJS_18_X,
        handler: 'hello.main',
        code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
        environment: {
            TABLE_NAME: props.spacesTable.tableName,
        }
    })*/
    /*const helloLambda = new NodejsFunction(this, 'HelloLambda', {
        runtime: Runtime.NODEJS_18_X,
        handler: 'handler',
        entry: (join(__dirname, '..', '..', 'services', 'hello.ts')),
        environment: {
            TABLE_NAME: props.spacesTable.tableName,
        }
    })

    helloLambda.addToRolePolicy(new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
            's3:ListAllMyBuckets',
            's3:ListBuckets',
        ],
        resources: ['*'], // bad practice, only for demo
    }))

    this.helloLambdaIntegration = new LambdaIntegration(spacesLambda);
    */


    const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: (join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts')),
      environment: {
        TABLE_NAME: props.spacesTable.tableName,
      },
      tracing: Tracing.ACTIVE,
      timeout: Duration.minutes(1)
    });

    spacesLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.spacesTable.tableArn],
      actions: [
        'dynamodb:PutItem',
        'dynamodb:Scan',
        'dynamodb:GetItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
      ]
    }))

    this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
  }
}