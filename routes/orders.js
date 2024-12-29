const { Router } = require("express");
const { 
  get_pending_orders_by_seller,
  get_pending_orders_by_customer,
  cancel_order
} = require("../controllers/orders");
const { validarJWT } = require("../helpers/validar-jwt");

const router = Router();

router.get("/pending/seller", validarJWT, get_pending_orders_by_seller);
router.get("/pending/customer", validarJWT, get_pending_orders_by_customer);
router.put('/cancelorder/:idPedido', validarJWT, cancel_order);


module.exports = router;
