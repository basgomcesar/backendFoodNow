const {response} = require('express');
//const mongoose = require('mongoose'); 
const {photoSchema} = require('../schemas/schemas');

// Creación de Modelos 
//const Photo = mongoose.model('Photo',photoSchema);

//Enpoint guardar foto
const upload_photo = async (req, res = response) => {
    if (!req.file) {
        return res.status(400).json({ mensaje: 'No se cargó ningún archivo' });
    }
    console.log('upload_photo: '+req.body.uid);
    try {
        // Buscar una foto existente con el uid proporcionado
        let photo = await Photo.findOne({ uid: req.body.uid });

        if (photo) {
            // Si la foto ya existe, actualiza el registro
            photo.data = req.file.buffer;
            photo.contentType = req.file.mimetype;
            await photo.save();
            res.json({
                mensaje: 'La foto ha sido actualizada correctamente'
            });
        } else {
            // Si la foto no existe, crea un nuevo registro
            const newPhoto = new Photo({
                data: req.file.buffer,
                contentType: req.file.mimetype,
                uid: req.body.uid
            });
            await newPhoto.save();
            res.json({
                mensaje: 'La foto ha sido guardada correctamente'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al guardar la foto'
        });
    }
};

//Endpoint obtener foto 
const get_photo_by_id = (async (req, res = response) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({
                mensaje: 'Recurso no encontrado',
            })
        }
        res.set('Content-Type', photo.contentType);
        res.send(photo.data);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la foto'
        });
    }
});

// Endpoint para obtener la foto del usuario por UID
const get_photo_by_uid = async (req, res = response) => {
    try {
        const photo = await Photo.findOne({ uid: req.params.uid });
        
        if (!photo) {
            return res.status(404).json({
                mensaje: 'Recurso no encontrado',
            });
        }
        
        res.set('Content-Type', photo.contentType);
        res.send(photo.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al obtener la foto'
        });
    }
};

module.exports = {
    upload_photo, 
    get_photo_by_id,
    get_photo_by_uid,
};