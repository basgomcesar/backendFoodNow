const { Router } = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
     get_statistics_products,
     get_products_offered, 
     add_product,  
     get_order_product,
     update_product,
     delete_product
} = require('../controllers/products');
const {validarJWT} = require('../helpers/validar-jwt');

const router = Router();



router.get('/statistics/:idSeller/:year/:month', validarJWT, get_statistics_products);
router.get('/offered/:idSeller', validarJWT, get_products_offered);
router.post("/", upload.single('foto'), validarJWT, add_product);
router.get("/orderproducts/:idPedido", validarJWT, get_order_product);
router.put("/update/:idProducto", validarJWT, update_product);
router.delete("/delete/:idProducto", validarJWT, delete_product);
module.exports = router;