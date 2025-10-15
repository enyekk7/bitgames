// Script untuk test Netlify function secara lokal
const { handler } = require('./netlify/functions/api.js');

// Mock Netlify event
const mockEvent = {
  httpMethod: 'GET',
  path: '/api/games',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'test'
  },
  queryStringParameters: null,
  body: null
};

const mockContext = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'api',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:api',
  memoryLimitInMB: '128',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/api',
  logStreamName: '2023/01/01/[$LATEST]test-stream',
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {}
};

// Test function
async function testNetlifyFunction() {
  console.log('🧪 Testing Netlify Function...');
  
  try {
    const result = await handler(mockEvent, mockContext);
    console.log('✅ Function executed successfully');
    console.log('Status Code:', result.statusCode);
    console.log('Headers:', result.headers);
    console.log('Body:', result.body);
  } catch (error) {
    console.error('❌ Function failed:', error);
  }
}

// Run test
testNetlifyFunction();
