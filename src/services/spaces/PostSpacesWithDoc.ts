import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb'
import {v4} from 'uuid'
import {marshall} from '@aws-sdk/util-dynamodb'
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb'

export async function postSpacesWithDoc(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  const randomId = v4();
  const item = JSON.parse(event.body);

  const result = await ddbDocClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: item
  }))

  console.log('PutItemCommand result: ', result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId, message: `Item created with id: ${randomId}` }),
  }
}