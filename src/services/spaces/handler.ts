import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {fromIni} from "@aws-sdk/credential-providers";
import {postSpaces} from './PostSpaces'
import {getSpaces} from './GetSpaces'
import {updateSpace} from './UpdateSpace'
import {deleteSpace} from './DeleteSpace'
import {JSONError, MissingFieldError} from '../shared/validator'
import {addCorsHeader} from '../shared/utils'
import { captureAWSv3Client, getSegment } from 'aws-xray-sdk-core'

// const ddbClient = new DynamoDBClient({
//   region: process.env.AWS_REGION,
//   // credentials: fromIni({profile: "udemy"}),
// });

const ddbClient = captureAWSv3Client(new DynamoDBClient({}))

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  // let message: string;
  let response: APIGatewayProxyResult;

  const subsegment = getSegment()?.addNewSubsegment('MyLongCall')
  await new Promise(resolve => setTimeout(resolve, 3000));
  subsegment?.close()

  const subsegment2 = getSegment()?.addNewSubsegment('MyLongCall')
  await new Promise(resolve => setTimeout(resolve, 1000));
  subsegment2?.close()

  try {
    switch (event.httpMethod) {
      case 'GET':
        // message = 'Hello, GET request received';
        // break;
        const getResult = await getSpaces(event, ddbClient);
        console.log('GetSpaces result: ', getResult);
        // addCorsHeader(getResult)
        // return getResult
        response = getResult
        break;
      case 'POST':
        // message = 'Hello, POST request received';
        // break
        // return await postSpaces(event, ddbClient)
        const postResponse = await postSpaces(event, ddbClient)
        response = postResponse
        break;
      case 'PUT':
        // return await updateSpace(event, ddbClient)
        const putResponse = await updateSpace(event, ddbClient)
        response = putResponse
        break;
      case 'DELETE':
        // return await deleteSpace(event, ddbClient)
        const deleteResponse = await deleteSpace(event, ddbClient)
        response = deleteResponse
        break;
      default:
        return {
          statusCode: 405,
          body: 'Method Not Allowed'
        };
    }

  } catch (error) {
    console.log('Error: ', error);
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: `Bad Request: ${error.message}`
      }
    }
    if (error instanceof JSONError) {
      return {
        statusCode: 400,
        body: `Bad Request: ${error.message}`
      }
    }
    return {
      statusCode: 500,
      body: `Internal Server Error: ${error.message}`
    }
  }

  // const response: APIGatewayProxyResult = {
  //   statusCode: 200,
  //   body: JSON.stringify({message}),
  // };
  console.log("Event: ", event);
  addCorsHeader(response)
  return response;
}

export {handler};