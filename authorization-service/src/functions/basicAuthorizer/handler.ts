import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda';

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  try {
    const { authorizationToken, methodArn } = event;
    const token = authorizationToken.split(' ')[1];
    console.log('Token: ', token);
    const [login, password] = Buffer.from(token, 'base64')
      .toString()
      .split(':');
    console.log('Login: ', login);
    console.log('Password: ', password);
    const isAuthorized = process.env[login] === password && password;
    console.log('isAuthorized', isAuthorized, process.env[login]);
    const authEffect = isAuthorized ? 'Allow' : 'Deny';

    return {
      principalId: authorizationToken,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Resource: [methodArn],
            Effect: authEffect,
          },
        ],
      },
    };
  } catch (error) {
    console.log(error);
  }
};
