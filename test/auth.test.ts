import {ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
  try {
    const service = new AuthService();

    // Login
    const loginResult = await service.login('dnilra', 'uuud9MTE.688KRF');

    console.log("Raw loginResult:", loginResult);

    // Try getting IdToken from the service itself (if AuthService caches it)
    const idToken = await service.getIdToken();
    console.log("IdToken from service.getIdToken():", idToken);
    const credetials = await service.generateTemporaryCredentials()
    console.log("credetials:", credetials);
    const buckets = await listBuckets(credetials);
    console.log("Buckets:", buckets);

  } catch (err) {
    console.error("Auth error:", err);
  }
}

async function listBuckets(credentials: any) {
  const s3Client = new S3Client({
    credentials: credentials
  });
  const commands = new ListBucketsCommand({})
  const result = await s3Client.send(commands);
  return result;
}

testAuth();
// ts-node test/auth.test.ts  -> to test this file on terminal