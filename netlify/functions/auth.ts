import { Handler } from '@netlify/functions';
import { UserService } from '../../src/services/userService';

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { action, ...data } = JSON.parse(event.body || '{}');
    const baseUrl = process.env.URL || 'http://localhost:8888';

    switch (action) {
      case 'sendMagicLink':
        const result = await UserService.sendMagicLink(data, baseUrl);
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result),
        };

      case 'verifyMagicLink':
        const { email, token } = data;
        if (!email || !token) {
          return {
            statusCode: 400,
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Email and token are required' }),
          };
        }

        const verificationResult = await UserService.verifyMagicLink(email, token);
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verificationResult),
        };

      case 'cleanupExpiredLinks':
        const cleanupResult = await UserService.cleanupExpiredMagicLinks();
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanupResult),
        };

      default:
        return {
          statusCode: 400,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
    };
  }
};
