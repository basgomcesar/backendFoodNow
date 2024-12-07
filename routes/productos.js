const { Router } = require("express");
const { 
  update_producto, 
  delete_producto, 
  get_productos_by_usuario 
} = require("../controllers/productos");

const router = Router();

// Ruta para actualizar un producto
router.put("/update/:idProducto", update_producto);

// Ruta para eliminar un producto
router.delete("/delete/:idProducto", delete_producto);

// Ruta para obtener todos los productos de un usuario
router.get("/usuario/:idUsuario", get_productos_by_usuario);

module.exports = router;
