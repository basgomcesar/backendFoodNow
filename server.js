const express = require('express'); 
// const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const startGrpcServer = require('./configRPC/grpc/grpcServer');
require("dotenv").config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/swagger'); // Importa la configuración de Swagger desde swagger.js

// Se crea la instancia del servidor con express
const app = express(); 

// Aquí es donde configuras Swagger para mostrar la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * Definición de las opciones de Cors
 * permite conexiones desde cualquier origen
 * métodos de HTTP 
 * Incluye cabecera x-token para pasar el JWT
 * Expone el encabezado x-token para ser leido desde el cliente
 */
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-token'], 
  exposedHeaders: ['x-token']
};

// Se definen todos los middlewares de la aplicación
app.use(cors(corsOptions)); 
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use('/usuarios', require('./routes/usuarios'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/utils', require('./routes/utils'));
app.use('/productos', require ('./routes/productos'));
app.use('/users', require('./routes/users'));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\nServidor está escuchando en puerto ${PORT}`);
});
// Iniciar el servidor gRPC
startGrpcServer();