const {response} = require('express');
const winston = require('winston');
const mongoose = require('mongoose'); 
const path = require('path'); 
const {errorSchema} = require('../schemas/schemas');


//Generar la Conexón a MongoDB
mongoose.connect('mongodb://localhost:27017/vuejs');

// Creación de Modelos 
const ErrorLog = mongoose.model('ErrorLog', errorSchema);

// Configuración de winston
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log') })
  ]
});

//Almacena el log de errores del cliente en la base de datos
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