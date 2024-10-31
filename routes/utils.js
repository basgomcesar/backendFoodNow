const {Router} = require('express');

const {log_errors} = require('../controllers/utils');

const router = Router();

router.post('/log_errors', log_errors);

module.exports = router;