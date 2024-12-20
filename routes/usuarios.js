const { Router } = require('express');
const multer = require('multer');
const { get_usuario_by_id_params, update_availability} = require('../controllers/usuarios');

const { validarJWT } = require('../helpers/validar-jwt');


const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Rutas
router.get('/:idUsuario', validarJWT, get_usuario_by_id_params); 
router.put('/availability/:idUsuario', validarJWT, update_availability);

module.exports = router;

