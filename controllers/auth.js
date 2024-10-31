const {response} = require('express');
const mongoose = require('mongoose'); 
const { generarJWT } = require('../helpers/generar-jwt');
const {usuarioSchema} = require('../schemas/schemas');


// Creación de Modelo
const Usuario = mongoose.model('Usuarios',usuarioSchema);

/**
 * Define la funcionalidad para buscar un usuario en mongo con correo y password indicados
 * @param {*} req 
 * @param {*} res 
 */
const login = (async(req, res = response)=>{
    try{
        const {correo, password} = req.body;
        const usuario = await Usuario.findOne({correo, password});
        console.log(`\nEl usuario ${correo} se está intentando loguear...`);
        if(usuario){
            console.log(`Login correcto.`);
            //Se genera un JWT con el ID del usuario creado
            const token = await generarJWT(usuario._id);
            //Se envía el token en el encabezado de la respuesta
            res.header('x-token', token);
            console.log(`Token enviado en el header: ${token}`);
            //Se envía el usuario en la respuesta
            res.json(usuario);
        }else{
            res.status(401).json({mensaje: 'Credenciales inválidas'});
        }
    }catch(error){
        console.error('Error en el logueo de usuario', error);
        res.status(500).json({mensaje: 'Error interno en el servidor'});

    }
});

module.exports = {login};