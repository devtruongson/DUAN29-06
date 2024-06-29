const express = require('express');

const CategoryController = require('../controllers/CategoryController');

let router = express.Router()


router.post('/create', CategoryController.create);

router.get('/list', CategoryController.list);

router.put('/update', CategoryController.update);

router.delete('/delete/:categoryID', CategoryController.deleteCategory);

module.exports = router;