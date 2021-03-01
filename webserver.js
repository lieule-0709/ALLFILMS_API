require('./src/i18n');
const express = require('express');
const winston = require('winston');
const async = require('async');

const app = express();
const routes = require('./src/routes');
const { masterDB } = require('./src/database');
const middleware = require('./src/middlewares');
const errorHandler = require('./src/middlewares/error-handler');
const setupWinston = require('./winston-setup');

function addRoutes(callback) {
  routes(app, middleware);
  app.use(errorHandler);
  callback();
}

function start() {
  async.waterfall(
    [
      (next) => masterDB.init(next),
      (next) => addRoutes(next)
    ],
    (err) => {
      if (err) {
        winston.error(err);
        // Either way, bad stuff happened. Abort start.
        process.exit();
      }
    }
  );
}

setupWinston();

start();

// Export your express server so you can import it in the lambda function.
module.exports = app;