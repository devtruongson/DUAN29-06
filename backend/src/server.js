import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import setRoute from './routes/index';
const session = require('express-session');
import { sequelize, connectDB } from './config/connectDB';
const { createRecordsDefault } = require('./config/createRecordsDefault');
const store = session.MemoryStore();

const User = require('./models/user');
const CustomerInfo = require('./models/customerInfo');
const Role = require('./models/role');
const Category = require('./models/category');
const Product = require('./models/product');
const Order = require('./models/order');

const OrderItem = require('./models/orderItem');
const Review = require('./models/review');
const ProductPicture = require('./models/productPicture');

const ProductVariant = require('./models/productVariant')

let app = express();
let port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'], // Thay thế bằng domain của frontend
  credentials: true
}));

global.__basedir = __dirname;
app.use('/static', express.static('./src/public'));
app.use(session({
  secret: 'your_app', // Thay thế bằng khóa bí mật của bạn
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: store
}));
setRoute(app);

(async () => {
  await connectDB();
  await createRecordsDefault();

  try {
    // Tắt kiểm tra khóa ngoại
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Đồng bộ hóa cơ sở dữ liệu
    await sequelize.sync({}); // force true để xóa và tạo lại bảng

    console.log('Database synchronization successful.');

  } catch (err) {
    console.error('Unable to synchronize with the database:', err);
  } finally {
    // Bật lại kiểm tra khóa ngoại
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
})();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
