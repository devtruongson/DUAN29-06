const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

const Order = require('../models/order');
const User = require('../models/user');
const CustomerInfo = require('../models/customerInfo');

const ProductVariant = require('../models/productVariant');
const Product = require('../models/product');

const OrderItem = require('../models/orderItem');
const Review = require('../models/review');



const create = async (req, res, next) => {
    try {
      let customerID = req.session.customerID;
    if (customerID === undefined) return res.status(400).send('Trường customerID không tồn tại');
        const {  productID, rating, comment } = req.body;

        // Kiểm tra các trường bắt buộc
        if (  !productID || !rating) {
            return res.status(400).send('Thiếu thông tin bắt buộc');
        }

        // Kiểm tra customer
        const customer = await User.findOne({ where: { userID:customerID, roleID: 2 } });
        if (!customer) return res.status(400).send('Customer không tồn tại');

        // Kiểm tra product
        const product = await Product.findOne({ where: { productID } });
        if (!product) return res.status(400).send('Product không tồn tại');

        // Kiểm tra review đã tồn tại
        const existingReview = await Review.findOne({ where: { userID:customerID, productID } });
        if (existingReview) return res.status(400).send('Review đã tồn tại');

        // Kiểm tra đơn hàng hợp lệ (đã giao và có sản phẩm)
        const order = await Order.findOne({
            where: { userID:customerID, orderState: 'Đã giao' },
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: ProductVariant,
                            where: { productID: productID },
                        },
                    ],
                },
            ],
        });

        if (!order) {
            return res.status(400).send('Không tìm thấy đơn hàng hợp lệ');
        }

        

        
        // Tạo review mới
        const review = await Review.create({
            userID:customerID,
            productID,
            rating, 
            comment
        });

        // Cập nhật đánh giá trung bình cho product sau khi tạo review
        const [result] = await Review.findAll({ // Truy vấn bảng Review
            attributes: [
                [Sequelize.fn('avg', Sequelize.col('rating')), 'avg'], 
                [Sequelize.fn('count', Sequelize.col('rating')), 'count'], 
            ],
            where: { productID },
        });

        await product.update({
            rating: parseFloat(result.dataValues.avg),
            reviewQuantity: parseInt(result.dataValues.count),
        });

        return res.send(review); 
    } catch (err) {
        console.error(err);
        return res.status(500).send('Lỗi server');
    }
};
let update = async (req, res, next) => {
    let reviewID = req.body.reviewID;
    if (reviewID === undefined) return res.status(400).send('Trường reviewID không tồn tại');
    let rating = req.body.rating;
    if (rating === undefined) return res.status(400).send('Trường rating không tồn tại');
    let comment = req.body.comment || '';
    

    try {
        let review = await Review.findOne({ where: { reviewID } })
        if (!review) res.status(400).send('Review này không tồn tại');
        else {
            await review.update({ rating,comment })

            // Lấy tất cả Review có product tương ứng với review vừa tạo
            // tính rate trung bình
            const product = await review.getProduct();
           
            let productID = product.productID;
            const [result] = await Review.findAll({ 
                attributes: [[Sequelize.fn('avg', Sequelize.col('rating')), 'avg']],
                where: { productID: productID }
              });
          
              const avgRating = parseFloat(result.dataValues.avg) || 0; // Xử lý trường hợp không có review
          
              // Cập nhật rating trung bình cho sản phẩm
              await product.update({ rating: avgRating });
          

            return res.send({ message: 'Cập nhật review thành công!' })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}
let detail = async (req, res, next) => {
    let customerID = req.session.customerID;
    if (customerID === undefined) return res.status(400).send('Trường customerID không tồn tại');
    let productID = req.params.productID;
    if (productID === undefined) return res.status(400).send('Trường productID không tồn tại');
    try {
        let customer = await User.findOne({ where: { userID: customerID, roleID: 2 } });
        if (customer == null) return res.status(400).send('Customer này không tồn tại');
        let product = await Product.findOne({ where: { productID } });
        if (product == null) return res.status(400).send('Product  này không tồn tại');

        let review = await Review.findOne({
            attributes: ['reviewID', 'rating', 'comment'],
            where: { userID: customerID, productID }
        })
        if (!review) res.status(400).send('Review này không tồn tại');
        else return res.send(review)
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}
let list = async(req, res, next) => {
    const productID = req.params.productID;
  
    if (productID === undefined) {
      return res.status(400).send('Trường productID không tồn tại');
    }
  
    try {
      const product = await Product.findOne({ where: { productID: productID } });
      if (!product) {
        return res.status(404).send('Product này không tồn tại');
      }
  
      // Lấy danh sách review của sản phẩm
      const reviewList = await Review.findAll({
        attributes: ['rating', 'comment', 'reviewDate'],
        include: [
          { 
            model: User,
            include: [
              { model: CustomerInfo, attributes: ['name'] }
            ]
          },
          {
            model: Product, // Include Product để lấy thông tin productVariant
            where: { productID: productID },
            
          }
        ],
        order: [['reviewDate', 'DESC']]
      });
  
      // Format dữ liệu review
      const formattedReviews = reviewList.map((review) => {
       
  
        return {
          customer: review.User.CustomerInfo.name,
          rating: review.rating,
          
          
          comment: review.comment,
          created_at: review.reviewDate,
        };
      });
  
      return res.send(formattedReviews);
  
    } catch (err) {
      console.error(err);
      return res.status(500).send('Lỗi máy chủ. Vui lòng thử lại sau.');
    }
  }
  
module.exports = {
    create,update,detail,list
}