const { Router } = require("express");
const { 
  update_producto, 
  delete_producto, 
  get_productos_by_usuario,
  add_product 
} = require("../controllers/productos");
const { validarJWT } = require("../helpers/validar-jwt");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


const router = Router();

// Ruta para obtener productos del usuario autenticado
router.get("/usuario", validarJWT, get_productos_by_usuario);



router.post("/", upload.single('foto'), validarJWT, add_product);

module.exports = router;
