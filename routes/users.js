const { Router } = require('express');
const multer = require('multer');
const { 
    save_user, 
    update_user, 
    delete_usuario, 
    update_availability
} = require('../controllers/users');
const { validarJWT } = require('../helpers/validar-jwt');
const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// Rutas
router.post('/', upload.single('foto'), save_user); 
router.put('/', upload.single('foto'), validarJWT, update_user);
router.delete('/', validarJWT, delete_usuario);
router.put('/availability/:idUsuario', update_availability);

module.exports = router;

