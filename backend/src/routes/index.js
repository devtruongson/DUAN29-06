import express from "express";

const adminRouter = require('./admin');

const customerRouter = require('./customer');

const categoryRouter = require('./category');

const productRouter = require('./product');

const productVariantRouter = require('./productVariant')

const orderRouter = require('./order');

const reviewRouter = require('./review');

let setRoute = (app) => {
    app.use('/api/admin', adminRouter);
    app.use('/api/customer', customerRouter)
    app.use('/api/category', categoryRouter);
    app.use('/api/product', productRouter)
    app.use('/api/productVariant', productVariantRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/review', reviewRouter)
}

module.exports = setRoute;