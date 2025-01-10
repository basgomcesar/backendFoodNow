const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación de API',
      version: '1.0.0',
      description: 'Documentación generada automáticamente con Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Cambia a tu URL base
      },
    ],
  },
  apis: ['./routes/*.js', './routes/users-doc.js'], // Aquí se definen los archivos que contienen las rutas
};

// Generar la documentación de Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
