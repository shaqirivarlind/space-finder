import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {DynamoDBClient, GetItemCommand, ScanCommand} from '@aws-sdk/client-dynamodb'
import {unmarshall} from '@aws-sdk/util-dynamodb'

export async function getSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

  if (event.queryStringParameters) {
    if ('id' in event.queryStringParameters) {
      const spaceId = event.queryStringParameters['id'];
      const getItemResponse = await ddbClient.send(new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          'id': {
            S: spaceId
          }
        }
      }))

      if (getItemResponse.Item) {
        const unmarshlledItem = unmarshall(getItemResponse.Item)
        console.log('GetItemCommand result: ', getItemResponse.Item, 'unmarshlledItem: ', unmarshlledItem);
        return {
          statusCode: 200,
          // body: JSON.stringify(getItemResponse.Item),
          body: JSON.stringify(unmarshlledItem),
        }
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Item with id ${spaceId} not found`),
        }
      }

    } else {
        return {
          statusCode: 400,
          body: JSON.stringify('Id not provided'),
        }
    }
  }

  const result = await ddbClient.send(new ScanCommand({
    TableName: process.env.TABLE_NAME
  }))
  const unmarshlledItems = result.Items?.map(item => unmarshall(item));

  console.log('ScanCommand result: ', result.Items, ' unmarshlledItems: ', unmarshlledItems);

  return {
    statusCode: 201,
    // body: JSON.stringify(result.Items),
    body: JSON.stringify(unmarshlledItems),
  }
}