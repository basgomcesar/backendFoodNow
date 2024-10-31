const {Router} = require('express');
const path = require('path');
const multer = require('multer')
// Configuración de almacenamiento de multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { 
    upload_photo, 
    get_photo_by_id,
    get_photo_by_uid,
     } = require('../controllers/photos');

const router = Router();

router.get('/:id', get_photo_by_id); 
router.get('/by_user/:uid', get_photo_by_uid); 
router.post('/upload', upload.single('photo'), upload_photo);

module.exports = router;