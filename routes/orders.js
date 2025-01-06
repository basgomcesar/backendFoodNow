const path = require('path');
const multer = require('multer')
const { Router } = require("express");

const { validarJWT } = require("../helpers/validar-jwt");

const router = Router();

const {
  get_pending_orders_by_seller,
  get_pending_orders_by_customer,
  cancel_order,
  confirm_order,
    add_order,

} = require('../controllers/orders');

router.get("/pending/seller", validarJWT, get_pending_orders_by_seller);
router.get("/pending/customer", validarJWT, get_pending_orders_by_customer);
router.put('/cancelorder/:idPedido', validarJWT, cancel_order);
router.put('/confirmOrder/:idPedido', validarJWT, confirm_order);

// Ruta para agregar una orden
router.post('/', validarJWT, add_order);


module.exports = router;