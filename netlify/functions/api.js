const severless = require('serverless-http');

const app = require('../../index');

module.exports.handler = severless(app);