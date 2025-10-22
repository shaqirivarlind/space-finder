import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib'
import { Bucket } from 'aws-cdk-lib/aws-s3';
import {Construct} from 'constructs'
import {getSuffixFromStack} from '../Util'
import {join} from 'path'
import {existsSync} from 'node:fs'
import {BucketDeployment, Source} from 'aws-cdk-lib/aws-s3-deployment'
import {AccessLevel, Distribution, OriginAccessIdentity, ViewerProtocolPolicy} from 'aws-cdk-lib/aws-cloudfront'
import {S3BucketOrigin, S3Origin} from 'aws-cdk-lib/aws-cloudfront-origins'

export class UIDeploymentStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, 'uiDeploymentBucket', {
      bucketName: `ui-deployment-bucket-${suffix}`,
    });

    // const uiDir = join(__dirname, '..', '..', '..', '..', 'space-finder-frontend', 'dist'); //  to other app finder frontend
    const uiDir = join(__dirname, '..', '..', '..', '..', 'space-finder-frontend-2', 'dist'); //  to other app finder frontend
    if (!existsSync(uiDir)) {
      console.warn(`UI directory does not exist: ${uiDir}. Please build the frontend before deploying the stack.`);
      return;
    }

    new BucketDeployment(this, 'SpaceFinderUIDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)]
    })

   /*  DEPRECATED way
   const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity')
    deploymentBucket.grantRead(originAccessIdentity);

    const distribution = new Distribution(this, 'SpaceFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originAccessIdentity
        }),
      }
    })*/

    const s3Origin = S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
      originAccessLevels: [AccessLevel.READ],
    });

    const distribution = new Distribution(this, 'SpacesFinderDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: s3Origin
      }
    });

    new CfnOutput(this, 'SpaceFinderUrl', {
      value: distribution.distributionDomainName
    })

  }
}