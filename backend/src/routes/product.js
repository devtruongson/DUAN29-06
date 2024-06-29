const express = require('express');

const ProductController = require('../controllers/ProductController');

let router = express.Router()


router.post('/create', ProductController.create);
router.put('/update',ProductController.update)
router.get('/listAdminSide',ProductController.listAdminSide)
router.get('/listCustomerSide',ProductController.listCustomerSide)
router.get('/customer/detail/:productID', ProductController.detailCustomerSide);

router.get('/admin/detail/:productID', ProductController.detailAdminSide);

router.get('/customer/list-colour/:productID/', ProductController.listColour);

router.get('/customer/list-size/:productID/:Colour', ProductController.listSize);

module.exports = router;