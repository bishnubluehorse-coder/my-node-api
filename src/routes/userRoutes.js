const router = require('express').Router();

const userController = require('../controller/userController');
const { uploadImage, validateImage } = require('../middleware/imageUpload');

router.post('/create', uploadImage, validateImage, userController.createUser);
router.get('/users', userController.getUsers);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;