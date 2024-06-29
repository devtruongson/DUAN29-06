const express = require('express');

const AdminController = require('../controllers/AdminControllers');

let router = express.Router()


router.post('/register', AdminController.register);

router.post('/login', AdminController.login);



module.exports = router;