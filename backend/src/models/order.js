const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/connectDB');

const User = require('./user');
const Order = sequelize.define('Order', {
  orderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  orderState: {
    type: DataTypes.ENUM(
      'Chờ xác nhận',
      'Đã xác nhận',
      'Đang giao hàng',
      'Đã giao',
      'Đã hủy',
      
    ),
    defaultValue: 'Chờ xác nhận',
    allowNull: false,
  },
  totalProductValue: { type: DataTypes.INTEGER, allowNull: false },
	deliveryCharges: { type: DataTypes.INTEGER, allowNull: false },
	totalOrderValue: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: false
});


Order.belongsTo(User, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false  }
});
User.hasMany(Order, {
    foreignKey: { name: 'userID', type: DataTypes.INTEGER, allowNull: false  }
});
module.exports = Order;