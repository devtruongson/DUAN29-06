const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/connectDB');
const User = require('./user')
const CustomerInfo = sequelize.define('CustomerInfo', {
  customerInfoID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: true },
  phoneNumber: { type: DataTypes.STRING, allowNull:false,unique: true },
  address: { type: DataTypes.STRING, allowNull:false},
});
CustomerInfo.belongsTo(User, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false, unique: true  }
});
User.hasOne(CustomerInfo, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false, unique:true  }
});
module.exports = CustomerInfo;