const { Router } = require('express');
const multer = require('multer');
const { save_usuario, get_usuario_by_id_params, update_usuario, delete_usuario, update_availability } = require('../controllers/usuarios');
const { validarJWT } = require('../helpers/validar-jwt');

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Rutas
router.get('/:idUsuario', validarJWT, get_usuario_by_id_params); 
router.post('/', upload.single('foto'), save_usuario);  // Aquí aplicamos el middleware de multer
router.put('/:idUsuario', upload.single('foto'), validarJWT, update_usuario);
router.delete('/:idUsuario', validarJWT, delete_usuario);
router.put('/availability/:idUsuario', validarJWT, update_availability);



module.exports = router;
