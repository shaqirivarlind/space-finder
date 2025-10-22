import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {DynamoDBClient, PutItemCommand} from '@aws-sdk/client-dynamodb'
import {v4} from 'uuid'
import {marshall} from '@aws-sdk/util-dynamodb'
import {validateAsSpaceEntry} from '../shared/validator'
import {createRandomId, parseJSON} from '../shared/utils'


export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  // const randomId = v4();
  const randomId = createRandomId(); // it is better to have it on utils, because we can change the implementation later or any security risk to the packgage then we need to change only once
  // const item = JSON.parse(event.body);
  const item = parseJSON(event.body);
  item.id = randomId;
  validateAsSpaceEntry(item)

  const result = await ddbClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    // Item: {
    //   id: {
    //     S: randomId
    //   },
    //   location: {
    //     S: item.location
    //   },
    // }
    // Item: marshall(
    //   {
    //     id: {
    //       S: randomId
    //     },
    //     location: {
    //       S: item.location
    //     },
    //   }
    // )
    Item: marshall(item)
  }))

  console.log('PutItemCommand result: ', result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId, message: `Item created with id: ${randomId}` }),
  }
}