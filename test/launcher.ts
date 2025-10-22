// import {handler} from "../src/services/hello";
import {handler} from "../src/services/spaces/handler";


// process.env.AWS_PROFILE = "udemy"
  process.env.AWS_REGION = "eu-central-1"
process.env.TABLE_NAME = "SpacesTable.0aa1897fb8ff"

// handler({} as any, {} as any);

// handler({
//   httpMethod: 'POST',
//   body: JSON.stringify({
//     location: 'London, console'
//   })
// } as any, {} as any)
//   .then(console.log)
//   .catch(console.error);

// handler({
//   httpMethod: 'GET',
//   queryStringParameters: {
//     id: 'b6269b51-df41-4214-9d80-799cef362977'
//   }
// } as any, {} as any)
//   .then(console.log)
//   .catch(console.error);

// handler({
//   httpMethod: 'PUT',
//   queryStringParameters: {
//     id: 'b6269b51-df41-4214-9d80-799cef362977'
//   },
//   body: JSON.stringify({
//     location: 'Dublin updated'
//   }),
// } as any, {} as any)
//   .then(console.log)
//   .catch(console.error);

// handler({
//   httpMethod: 'DELETE',
//   queryStringParameters: {
//     id: 'b6269b51-df41-4214-9d80-799cef362977'
//   },
// } as any, {} as any)
//   .then(console.log)
//   .catch(console.error);

handler({
  httpMethod: 'POST',
  body: JSON.stringify({
    location: 'London, console'
  })
} as any, {} as any)
  .then(console.log)
  .catch(console.error);