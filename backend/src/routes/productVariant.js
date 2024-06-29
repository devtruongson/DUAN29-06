const express = require('express');


const ProductVariantController = require('../controllers/ProductVariantController');

let router = express.Router();

router.post('/create', ProductVariantController.create);




router.put('/update-quantity', ProductVariantController.updateQuantity);

router.delete('/delete/:productVariantID', ProductVariantController.deleteProductVariant);

router.get('/customer/detail/:productID/:Colour/:Size', ProductVariantController.detailCustomerSide);


module.exports = router;