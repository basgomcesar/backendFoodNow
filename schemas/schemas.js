const mongoose = require('mongoose'); 
const { Schema } = mongoose;

/**
 * Define el esquema de usuarios
 */
const usuarioSchema = new mongoose.Schema({
    usuario: String,
    correo: String,
    password: String,
    direccion: String,
    nombre: String,
    telefono: String
});

/**
 * Define el esquema para almacenar logs
 */
const errorSchema = new mongoose.Schema({
    error: String,
    info: String,
    url: String,
    date: { type: Date, default: Date.now }
});

/**
 * Define el esquema de imagenes
 */
const photoSchema = new Schema({
    data: Buffer,
    contentType: String,
    uid: String
});

//Exporta los esquemas creados para ser usados en otras partes del servidor
module.exports = {
    usuarioSchema, 
    photoSchema,
    errorSchema
}
