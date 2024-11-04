const {Router} = require('express');

const { 
    get_all_usuarios,
    save_usuario,
    get_usuario_by_id_body,
    update_usuario,
    delete_usuario
     } = require('../controllers/usuarios');

     const {validarJWT} = require('../helpers/validar-jwt');

const router = Router();

router.get('', get_all_usuarios); 
router.get('/:idUsuario', get_usuario_by_id_body); 
router.post('/', save_usuario);
router.put('/update/:idUsuario', update_usuario);
router.delete('/delete/:idUsuario',[validarJWT], delete_usuario);

module.exports = router;