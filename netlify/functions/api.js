const serverless = require('serverless-http');
const app = require('../../index');

// eslint-disable-next-line import/prefer-default-export
export const handler = serverless(app);
