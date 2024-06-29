const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');
const Product = require('./product');
const User = require('./user');
const Review = sequelize.define('Review', {
  reviewID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reviewDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  comment: DataTypes.TEXT,
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  
  
}, {
  timestamps: false
});
Review.belongsTo(Product, {
    foreignKey: { name: 'productID', type: DataTypes.INTEGER, allowNull: false }
});
Product.hasMany(Review, {
    foreignKey: { name: 'productID', type: DataTypes.INTEGER, allowNull: false }
});
User.hasMany(Review, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false  }
});
Review.belongsTo(User, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false  }
});
module.exports = Review;