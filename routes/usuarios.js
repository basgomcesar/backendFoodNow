const {Router} = require('express');

const { 
    get_all_usuarios,
    save_usuario,
    get_usuario_by_id_params,
    update_usuario,
    delete_usuario
     } = require('../controllers/usuarios');

const {validarJWT} = require('../helpers/validar-jwt');

const router = Router();

router.get('', get_all_usuarios); 
<<<<<<< HEAD
router.get('/:idUsuario', get_usuario_by_id_body); 
router.post('/', save_usuario);
router.put('/update/:idUsuario', update_usuario);
router.delete('/delete/:idUsuario',[validarJWT], delete_usuario);
=======
router.get('/:idUsuario', [validarJWT], get_usuario_by_id_params); 
router.post('/', save_usuario);
router.put('/:idUsuario', [validarJWT], update_usuario);
router.delete('/:idUsuario', [validarJWT], delete_usuario);
>>>>>>> develop-caixba

module.exports = router;