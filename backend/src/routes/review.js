const express = require('express');

const ReviewController = require('../controllers/ReviewController');
const sessionAuth = require('../middlewares/sessionAuth')
let router = express.Router();

router.get('/list/:productID', ReviewController.list);

router.get('/detail/:customerID/:productID',sessionAuth, ReviewController.detail);

router.post('/create',sessionAuth, ReviewController.create);

router.put('/update',sessionAuth, ReviewController.update);

module.exports = router;