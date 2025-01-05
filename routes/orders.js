const {Router} = require('express');
const path = require('path');
const multer = require('multer')

const {
    get_orders,
    get_order_by_id,
    add_order,
    update_order,
    delete_order
} = require('../controllers/orders');

const {validarJWT} = require('../helpers/validar-jwt');

const router = Router();

// Ruta para obtener todas las ordenes
router.get('/', validarJWT, get_orders);

// Ruta para obtener una orden por su id
router.get('/:idOrden', validarJWT, get_order_by_id);

// Ruta para agregar una orden
router.post('/', validarJWT, add_order);

// Ruta para actualizar una orden
router.put('/:idOrden', validarJWT, update_order);

// Ruta para eliminar una orden
router.delete('/:idOrden', validarJWT, delete_order);

module.exports = router;