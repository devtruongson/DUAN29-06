const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');

const Category = sequelize.define('Category', {
  categoryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT
}, {
  timestamps: false
});

module.exports = Category;