const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');

const Role = sequelize.define('Role', {
  roleID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  roleName: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  timestamps: false
});

module.exports = Role;