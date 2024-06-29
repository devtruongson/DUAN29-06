const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/connectDB');
const Order = require('./order');
const ProductVariant = require('./productVariant');

const OrderItem = sequelize.define('OrderItem', {
	orderID: { type: DataTypes.INTEGER, primaryKey: true },
	productVariantID: { type: DataTypes.INTEGER, primaryKey: true },
	
	price: { type: DataTypes.INTEGER, allowNull: false },
	quantity: { type: DataTypes.INTEGER, allowNull: false },
	totalValue: { type: DataTypes.INTEGER, allowNull: false },
}, {
	timestamps: false,
})

Order.belongsToMany(ProductVariant, {
	through: OrderItem,
	foreignKey: 'orderID',
	otherKey: 'productVariantID'
});
ProductVariant.belongsToMany(Order, {
	through: OrderItem,
	foreignKey: 'productVariantID',
	otherKey: 'orderID'
});

Order.hasMany(OrderItem, {
	foreignKey: { name: 'orderID', type: DataTypes.INTEGER }
});
OrderItem.belongsTo(Order, {
	foreignKey: { name: 'orderID', type: DataTypes.INTEGER }
});

ProductVariant.hasMany(OrderItem, {
	foreignKey: { name: 'productVariantID', type: DataTypes.INTEGER }
});
OrderItem.belongsTo(ProductVariant, {
	foreignKey: { name: 'productVariantID', type: DataTypes.INTEGER }
});

module.exports = OrderItem;