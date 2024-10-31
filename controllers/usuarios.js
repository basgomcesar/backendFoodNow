const {response} = require('express');
const mongoose = require('mongoose'); 
const {usuarioSchema} = require('../schemas/schemas');
//Generar la Conexón a MongoDB
mongoose.connect('mongodb://localhost:27017/vuejs');
const db = mongoose.connection;

// Creación de Modelos 
const Usuario = mongoose.model('Usuarios',usuarioSchema);

/**
 * Obtiene lista de todos los usuarios de la base de datos
 * @param {*} req 
 * @param {*} res 
 */
const get_all_usuarios = (async(req, res = response) =>{
    try {
        const usuarios = await db.collection('usuarios').find().toArray();
        res.json({ usuarios });
        console.log("Respuesta:\n",usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios: ',error);
        res.status(500).json({ error: 'Error Interno del Servidor'});
    }
});

/**
 * Registra un usuario en base de datos
 * @param {*} req 
 * @param {*} res 
 */
const save_usuario = (async(req, res = response) => {
    try {
        const usuario = new Usuario({
            id: new mongoose.Types.ObjectId(),
            ...req.body
        });
        const resultado = await usuario.save();
        res.status(201).send(resultado);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * Obtiene un usuario por ID, el parámetro _id viene en el cuertpo de la solicitud
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const get_usuario_by_id_body = (async(req, res = response)=>{
    try{
        const {_id} = req.body;
        if(!_id){
            return res.sta|(400).json({mensaje:'requiere de un ID'});
        }
        const usuario = await Usuario.findById(_id);
        if(!usuario){
            return res.status(400).json({
                mensaje: 'ID de Usuario no fue localizado'
            });
        }
        res.json(usuario);
    }catch(error){
        console.error('Error al buscar usuario por ID: ',error);
        res.status(500).json({mensaje:'Error interno del servidor'});
    }
});

/**
 * Actualiza a un usuario, el _id del usuario viene en el cuerpo de la solicitud
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const update_usuario_body = (async(req, res = response)=>{
    try{
        const {_id, nombre, correo} = req.body;
        if(!_id ||( !nombre && !correo)){
            return res.status(400).json({
                mensaje: 'Se requiere proporcionar ID y al menos campos a actualizar (nombre, correo'
            });
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(_id,{nombre, correo}, {new : true});
        if(!usuarioActualizado){
            res.status(404).json({mensaje:'Usuario no fue encontrado'});
        }
        res.json(usuarioActualizado);
    }catch(error){
        console.error('Error al actualizar usuario por ID: ', error);
        res.status(500).json({mensaje:'Error interno del servidor'});
    }
});

/**
 * Actualiza la información del usuario, el id viene en el parámetro de segmento
 * @param {*} req 
 * @param {*} res 
 * @returns usuario actualizado
 */
const update_usuario = (async(req, res = response) => {
    try {
        const { id } = req.params;
        const actualizaciones = req.body;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, actualizaciones, { new: true, runValidators: true });
        
        if (!usuarioActualizado) {
            return res.status(404).send({mensaje: 'Usuario no encontrado' });
        }
        
        res.send(usuarioActualizado);
    } catch (error) {
        res.status(400).send(error);
    }
});

/**
 * Elimina usuario
 * @param {*} req 
 * @param {*} res 
 * @returns mensaje de eliminación
 */
const delete_usuario = (async(req, res = response) => {
    try {
        const { id } = req.params;
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        if (!usuarioEliminado) {
            return res.status(404).send({ mensaje: 'Usuario no encontrado' });
        }        
        res.send({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = {
    get_all_usuarios,
    save_usuario,
    get_usuario_by_id_body,
    update_usuario_body,
    update_usuario,
    delete_usuario
};