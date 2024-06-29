const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/connectDB');
const Product = require('./product');


const ProductVariant = sequelize.define('productVariant', {
	productVariantID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	Colour: {type:DataTypes.STRING, allowNull:false},
	Size: {type:DataTypes.STRING, allowNull:false},
	quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
	
}, {
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: false,
	paranoid: true,
	deletedAt: 'deleted_at'
})

Product.hasMany(ProductVariant, {
	foreignKey: { name: 'productID', type: DataTypes.INTEGER, allowNull: false }
});
ProductVariant.belongsTo(Product, {
	foreignKey: { name: 'productID', type: DataTypes.INTEGER, allowNull: false }
});





module.exports = ProductVariant;