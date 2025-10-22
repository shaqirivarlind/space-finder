import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {
    AuthorizationType,
    CognitoUserPoolsAuthorizer,
    Cors,
    LambdaIntegration,
    MethodOptions,
    RestApi,
    ResourceOptions
} from "aws-cdk-lib/aws-apigateway";
import {IUserPool} from 'aws-cdk-lib/aws-cognito'

interface ApiStackProps extends StackProps {
  // helloLambdaIntegration: LambdaIntegration
  spacesLambdaIntegration: LambdaIntegration,
  userPool: IUserPool
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'SpaceApi', {
      restApiName: 'SpaceApi',
    })

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    }

    const spacesResource = api.root.addResource('spaces', optionsWithCors);

    const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
      cognitoUserPools: [props.userPool],
      identitySource: 'method.request.header.Authorization',
    })
    authorizer._attachToApi(api)

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      }
    }

    // spacesResource.addMethod('GET', props.helloLambdaIntegration);
    spacesResource.addMethod('GET', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResource.addMethod('POST', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResource.addMethod('PUT', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResource.addMethod('DELETE', props.spacesLambdaIntegration, optionsWithAuth);
  }
}