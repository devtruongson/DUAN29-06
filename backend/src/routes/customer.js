const express = require('express');

const CustomerController = require('../controllers/CustomerControllers');
const sessionAuth = require('../middlewares/sessionAuth')
let router = express.Router()


router.post('/register', CustomerController.register);

router.post('/login', CustomerController.login);
router.post('/logout', sessionAuth, CustomerController.logout);
router.get('/infor', sessionAuth, CustomerController.getInfor);
router.put('/update', sessionAuth, CustomerController.update);
router.put('/update', CustomerController.update);



module.exports = router;