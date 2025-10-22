import { Amplify } from 'aws-amplify';
import { SignInOutput, fetchAuthSession, signIn } from '@aws-amplify/auth'
import {CognitoIdentityClient} from '@aws-sdk/client-cognito-identity'
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers'

const awsRegion = 'eu-central-1';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-central-1_4El5exXPD',
      userPoolClientId: 'cp2dcuojnu1vchapfqgvttk2l', // from spate on tab (App Client on left sidebar)
      identityPoolId: 'eu-central-1:b184ac13-6f3b-452a-81e8-25030458e5e2',
    }
  }
});

export  class AuthService {
  public async login(userName: string, password: string): Promise<SignInOutput> {
    const signInOutput = await signIn({
      username: userName,
      password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH',
      }
    });

    return signInOutput;
  }

  /*
   * Call only after login
   */
  public async getIdToken(): Promise<string> {
    const authSession = await fetchAuthSession();
    const cognitoUserSession = authSession?.tokens?.idToken.toString();

    return cognitoUserSession;
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/eu-central-1_4El5exXPD`

    const cognetoIdentity =  new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'eu-central-1:b184ac13-6f3b-452a-81e8-25030458e5e2',
        logins: {
          [cognitoIdentityPool]: idToken
        }
      })
    })

    const credetials = await cognetoIdentity.config.credentials();
    return credetials;

  }
}