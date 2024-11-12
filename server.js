const express = require('express'); 
//const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const startGrpcServer = require('./configRPC/grpc/grpcServer');
require("dotenv").config();


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

//Se crea la instancia del servidor con express
const app = express(); 

//Se definen todos los middlewares de la aplicación
app.use(cors(corsOptions)); 
//app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
//app.use(bodyParser.json()); // Analizar cuerpos de solicitudes en formato JSON 

// Se definen las rutas de los servicios que ofrece el API
app.use('/usuarios', require('./routes/usuarios'));
app.use('/photos', require('./routes/photos'));
app.use('/auth', require('./routes/auth'));
app.use('/utils', require('./routes/utils'));
  

//Se define el puerto en el que funciona el servidor
const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`\nServidor esta escuchando en puerto ${PORT}`);
});
// Iniciar el servidor gRPC
startGrpcServer();