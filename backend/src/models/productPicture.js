const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');
const Product = require('./product');

const ProductPicture = sequelize.define('ProductPicture', {
  productPictureID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  path: {
    type: DataTypes.STRING,
    allowNull: false }
 
  
   
  
}, {
  timestamps: false
});

ProductPicture.belongsTo(Product, {
    foreignKey: { name: 'productID', type: DataTypes.INTEGER, allowNull: false }
  });
  Product.hasMany(ProductPicture, {
	foreignKey: { name: 'productID', type: DataTypes.INTEGER, allowNull: false }
  });
  module.exports=ProductPicture;