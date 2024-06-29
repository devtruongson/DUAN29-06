const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');
const Role = require('./role');

const User = sequelize.define('User', {
  userID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: false
});
User.belongsTo(Role, {
  foreignKey: { name: 'roleID', type: DataTypes.INTEGER, allowNull: false }
});
Role.hasMany(User, {
  foreignKey: { name: 'roleID', type: DataTypes.INTEGER, allowNull: false }
});
module.exports = User;