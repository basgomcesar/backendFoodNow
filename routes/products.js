const { Router } = require('express');
const multer = require('multer');
const {
     get_statistics_products,
     get_products_offered, 
     add_product,  
     get_order_product,
     update_product,
     delete_product
} = require('../controllers/products');

router.get('/statistics/:idSeller/:year/:month', validarJWT, get_statistics_products);
router.get('/offered/:idUsuario', validarJWT, get_products_offered);
router.post("/", upload.single('foto'), validarJWT, add_product);
router.get("/orderproducts/:idPedido", validarJWT, get_order_product);
router.put("/update/:idProducto", validarJWT, update_product);
router.delete("/delete/:idProducto", validarJWT, delete_product);
module.exports = router;