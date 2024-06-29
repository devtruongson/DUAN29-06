const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');
const Category = require('./category');

const Product = sequelize.define('Product', {
  productID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name : {
    type : DataTypes.STRING,
    allowNull: false
  },
 
  description: DataTypes.TEXT,
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
	sold: { type: DataTypes.INTEGER, defaultValue: 0 },
  reviewQuantity :{ type: DataTypes.INTEGER, defaultValue: 0 },
	
 
  
   
  
}, {
  timestamps: true,
	createdAt: 'created_at',
	updatedAt: false,
	paranoid: true,
	deletedAt: 'deleted_at'
});

Product.belongsTo(Category, {
    foreignKey: { name: 'categoryID', type: DataTypes.INTEGER, allowNull: false }
  });
  Category.hasMany(Product, {
	foreignKey: { name: 'categoryID', type: DataTypes.INTEGER, allowNull: false }
  });
 
  module.exports=Product;