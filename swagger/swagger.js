const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path');

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación de API - Food Now",
      version: "1.0.0",
      description: "Documentación generada automáticamente con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // Cambia a tu URL base
      },
    ],
  },
  apis: [
    path.join(__dirname, "*.js"),
  ], // Aquí se definen los archivos que contienen las rutas
};

// Generar la documentación de Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
