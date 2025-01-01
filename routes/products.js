const { Router } = require('express');
const multer = require('multer');
const { get_statistics_products  } = require('../controllers/products');
const { validarJWT } = require('../helpers/validar-jwt');

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

//Routes
router.get('/statistics/:idSeller/:year/:month', get_statistics_products);

module.exports = router;