const {Router} = require('express');

const { 
    save_usuario,
    get_usuario_by_id_params,
    update_usuario,
    delete_usuario,
    change_disponibility,
    
     } = require('../controllers/usuarios');

const {validarJWT} = require('../helpers/validar-jwt');

const router = Router();
router.get('/:idUsuario', [validarJWT], get_usuario_by_id_params); 
router.post('/', save_usuario);
router.put('/:idUsuario', [validarJWT], update_usuario);
router.delete('/:idUsuario', [validarJWT], delete_usuario);
router.patch('/:idUsuario', [validarJWT], change_disponibility);

module.exports = router;