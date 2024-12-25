const { Router } = require("express");
const { 
  get_pedidos_activos_by_usuario, 
  get_productos_by_pedido 
} = require("../controllers/pedidos");
const { validarJWT } = require("../helpers/validar-jwt");

const router = Router();

router.get("/activos/usuario", validarJWT, get_pedidos_activos_by_usuario);

module.exports = router;
