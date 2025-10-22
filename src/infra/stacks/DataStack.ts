import {CfnOutput, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {AttributeType, ITable, Table} from "aws-cdk-lib/aws-dynamodb";
import {getSuffixFromStack} from "../Util";
import {Bucket, BucketAccessControl, HttpMethods, IBucket, ObjectOwnership} from "aws-cdk-lib/aws-s3";

export class DataStack extends Stack {

  public readonly spacesTable: ITable;
  public readonly photoBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.spacesTable = new Table(this, 'SpacesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      // tableName: 'SpacesTable',// if two dev deploy the same name throws error
      tableName: `SpacesTable.${suffix}`
    })

    this.photoBucket = new Bucket(this, 'SpaceFinderPhotos', {
      bucketName: `space-finder-photos-${suffix}`,
      cors: [{
        allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.HEAD],
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
      }],
      accessControl: BucketAccessControl.PUBLIC_READ, // currently not working
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }
    })

      new CfnOutput(this, 'SpaceFinderPhotoBucketName', {
        value: this.photoBucket.bucketName,
      })
  }
}