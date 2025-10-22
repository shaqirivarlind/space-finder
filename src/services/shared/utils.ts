import {JSONError} from './validator'
import {v4} from 'uuid'
import {randomUUID} from 'crypto'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

export function addCorsHeader(arg: APIGatewayProxyResult) {

  if (!arg.headers) {
    arg.headers= {}
  }
  arg.headers['Access-Control-Allow-Origin'] = '*'
  arg.headers['Access-Control-Allow-Methods'] = '*'
  return arg
}

export function createRandomId() {
  // return v4()
  return randomUUID()
}
export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new JSONError(`Invalid JSON string: ${error.message}`);
  }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];

  if (!groups) {
    return (groups as string).includes('admins')
  }

  return false
}

export function hasAdminGroup2(event: APIGatewayProxyEvent): boolean {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];

  // If groups is defined, check if it includes 'admins'
  if (groups && typeof groups === 'string') {
    return groups.includes('admins');
  }

  return false; // Not in admin group
}
