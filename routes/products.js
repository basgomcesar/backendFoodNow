const { Router } = require('express');
const multer = require('multer');
const {
     get_statistics_products,
     get_products_offered, 
     add_product  
} = require('../controllers/products');
const { validarJWT } = require('../helpers/validar-jwt');
const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/statistics/:idSeller/:year/:month', validarJWT, get_statistics_products);
router.get('/offered/:idUsuario', validarJWT, get_products_offered);
router.post("/", upload.single('foto'), validarJWT, add_product);


module.exports = router;