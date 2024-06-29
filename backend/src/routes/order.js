const express = require('express');

const OrderController = require('../controllers/OrderController');
const sessionAuth = require('../middlewares/sessionAuth')
let router = express.Router()


router.post('/create',sessionAuth, OrderController.create);
router.put('/changeStatus/:orderID/:newState',OrderController.changeStatus)
router.get('/admin/list', OrderController.listAdminSide);
router.get('/customer/list/:customerID',sessionAuth, OrderController.listCustomerSide);
router.get('/detail/:customerID/:orderID',sessionAuth, OrderController.detailCustomerSide);
router.get('/admin/detail/:orderID', OrderController.detailAdminSide);


module.exports = router;