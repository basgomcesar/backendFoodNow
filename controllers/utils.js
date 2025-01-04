const {response} = require('express');
const winston = require('winston');
const path = require('path'); 

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log') })
  ]
});

const log_errors = ((req, res = response) => {
    const { error, info, url } = req.body;
    const errorLog = new ErrorLog({ error, info, url });
    errorLog.save()
      .then(() => {
        logger.error(`Error: ${error}, Info: ${info}, URL: ${url}`);
        res.status(200).send('Error logged');
      })
      .catch(err => {
        res.status(500).send('Failed to log error');
      });
  });

  module.exports = {
    log_errors
  }