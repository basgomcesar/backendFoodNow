const { Router } = require("express");
const { 
  get_pedidos_activos_by_usuario, 
  get_productos_by_pedido 
} = require("../controllers/pedidos");
const { validarJWT } = require("../helpers/validar-jwt");

const router = Router();

// Ruta para obtener pedidos activos del usuario autenticado
router.get("/activos/usuario", validarJWT, get_pedidos_activos_by_usuario);

// Ruta para obtener productos de un pedido específico
router.get("/productos/:idPedido", validarJWT, get_productos_by_pedido);

module.exports = router;
