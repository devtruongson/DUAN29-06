

const Order = require('../models/order');
const User = require('../models/user');

const ProductVariant = require('../models/productVariant');
const Product = require('../models/product');
const CustomerInfo = require('../models/customerInfo');
const OrderItem = require('../models/orderItem');
const Review = require('../models/review');


let create = async (req, res, next) => {
    let userID = req.session.customerID;
    if (userID === undefined) return res.status(400).send('Trường userID không tồn tại');
    try {
        let user = await User.findOne({ where: { userID, roleID: 2 } });
        if (user == null) return res.status(400).send('User này không tồn tại');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tạo đơn hàng vui lòng thử lại');
    }
    let name = req.body.name;
    if (name === undefined) return res.status(400).send('Trường name không tồn tại');
    let email = req.body.email;
    if (email === undefined) return res.status(400).send('Trường email không tồn tại');
    let phoneNumber = req.body.phoneNumber;
    if (phoneNumber === undefined) return res.status(400).send('Trường phoneNumber không tồn tại');
    let shippingAddress = req.body.shippingAddress;
    if (shippingAddress === undefined) return res.status(400).send('Trường shippingAddress không tồn tại');
    let orderItems = req.body.orderItems;
    if (orderItems === undefined) return res.status(400).send('Trường orderItems không tồn tại');

    try {
        
        let newOrder = await Order.create({
            userID,
            
            name,
            email,
            phoneNumber,
            shippingAddress,
            orderState: 'Chờ xác nhận',
            totalProductValue: 0,
            deliveryCharges: 0,
            totalOrderValue: 0,
        });

        let totalProductValue = 0;
        for (let i = 0; i < orderItems.length; i++) {
            let orderItem = orderItems[i];
            let productVariant = await ProductVariant.findOne({
                attributes: ['productVariantID', 'quantity','productID'],
                include: [
                    {
                        model: Product, attributes: ['productID','price','sold'],
                        
                    },
                ],
                where: { productVariantID: orderItem.productVariantID }
            });
            if (productVariant == null)
                return res.status(400).send("Sản phẩm này không tồn tại");
           
            if (orderItem.quantity > productVariant.quantity)
                return res.status(400).send("Số lượng sản phẩm không hợp lệ");
            let productVariantPrice = productVariant.Product.price;
            let totalValue = productVariantPrice * orderItem.quantity;
            let newOrderItem = {
                orderID: newOrder.orderID,
                productVariantID: productVariant.productVariantID,
                orderItemIndex: i,
                price: productVariantPrice,
                quantity: orderItem.quantity,
                totalValue
            }
            await OrderItem.create(newOrderItem);
           let newProductVariantQuantity = productVariant.quantity - orderItem.quantity;
            await productVariant.update({ quantity: newProductVariantQuantity });
            totalProductValue += totalValue;
            ////await Product.increment('sold', { 
               // by: orderItem.quantity, 
               //where: { productID: productVariant.productID } 
             // });
        }
         
        let deliveryCharges = 20000
        let totalOrderValue = totalProductValue + deliveryCharges;
        newOrder.update({ totalProductValue, deliveryCharges, totalOrderValue });
        
        return res.send(newOrder)
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tạo đơn hàng vui lòng thử lại');
    }
}
let changeStatus = async (req, res, next) => {
    let orderID = req.params.orderID;
    if (!orderID) return res.status(400).send('Trường orderID không tồn tại');
  
    let newState = req.params.newState;
    if (!newState) return res.status(400).send('Trường newState không tồn tại');
  
    const validStateTransitions = {
      "Chờ xác nhận": ["Đã xác nhận", "Đã hủy"],
      "Đã xác nhận": ["Đang giao hàng", "Đã hủy"],
      "Đang giao hàng": ["Đã giao", "Đã hủy"],
      // "Đã giao", "Đã hủy" là các trạng thái cuối, không thể chuyển đi
    };
  
    try {
      let order = await Order.findOne({ where: { orderID } });
      if (!order) return res.status(400).send('Order này không tồn tại');
  
      // Kiểm tra xem trạng thái mới có hợp lệ từ trạng thái hiện tại không
      if (!validStateTransitions[order.orderState]?.includes(newState)) {
        return res.status(400).send('Trạng thái chuyển đổi không hợp lệ');
      }
  
      // Xử lý đặc biệt cho trạng thái "Đã giao"
      if (newState === "Đã giao") {
        let productVariantList = await order.getProductVariants();
        for (let productVariant of productVariantList) {
          let product = await productVariant.getProduct();
          product.sold += productVariant.OrderItem.quantity;
          await product.save();
        }
      }
  
      // Cập nhật trạng thái đơn hàng
      order.orderState = newState;
      await order.save();
      return res.send(order);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Gặp lỗi khi xử lý đơn hàng');
    }
  };
  
  let listAdminSide = async (req, res, next) => {
    try {
        let orderList = await Order.findAll({
            attributes: ['orderID', 'totalOrderValue','orderState'],
            where:{orderState:'Chờ xác nhận'},
        });

        orderList = orderList.map((order) => {
            let newOrder = {
                orderID: order.orderID,
                
                totalOrderValue: order.totalOrderValue,
                orderState: order.orderState,
                
            }
           
            return newOrder;
        });

        return res.send(orderList);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');

    }
}
let listCustomerSide = async (req, res, next) => {
    let customerID = req.session.customerID;
    if (customerID === undefined) {
        return res.status(400).send('Trường customerID không tồn tại');
    }

    try {
        let customer = await User.findOne({ 
            where: { userID: customerID, roleID: 2 } 
        });
        if (customer == null) {
            return res.status(404).send('Khách hàng không tồn tại'); 
        }
    } catch (err) {
        console.error('Lỗi khi tìm kiếm khách hàng:', err);
        return res.status(500).send('Lỗi server khi tìm kiếm khách hàng');
    }

    const orderList = await Order.findAll({
        attributes: ['orderID', 'totalOrderValue', 'orderDate', 'orderState'],
        where: { userID: customerID },
        include: [
          {
            model: OrderItem,
            include: [
              { 
                model: ProductVariant,
                required: true,
                attributes: ['productVariantID', 'quantity', 'Colour', 'Size'],
                include: [
                  {
                    model: Product,
                    attributes: ['productID', 'name', 'price'],
                    include: [
                      {
                        model: Review,
                        where: { userID: customerID },
                        required: false
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        order: [['orderDate', 'DESC']], // Sắp xếp theo ngày giảm dần
      });
  
      // Chuyển đổi dữ liệu thành định dạng mong muốn cho mỗi đơn hàng
     try { const formattedOrderList = await Promise.all(orderList.map(async (order) => {
        let productVariantList = await order.getProductVariants(); // Lấy danh sách sản phẩm
        let orderItemList = [];
  
        // Lặp qua danh sách sản phẩm và chuyển đổi thông tin
        for (let productVariant of productVariantList) {
          let product = await productVariant.getProduct();
          let review = await Review.findOne({
            where: {
              userID: customerID,
              productID: product.productID
            }
          });
  
          orderItemList.push({
            productVariantID: productVariant.productVariantID,
            name: product.name,
            // image: productImages?.[0]?.path || null, // Xử lý trường hợp không có ảnh
            quantity: productVariant.OrderItem.quantity,
            colour: productVariant.Colour,
            size: productVariant.Size,
            price: productVariant.OrderItem.price,
            hasReview: review != null // Kiểm tra xem có đánh giá không
          });
        }
  
        // Trả về thông tin đơn hàng đã chuyển đổi
        return {
          orderID: order.orderID,
          orderState: order.orderState,
          orderItems: orderItemList,
          totalOrderValue: order.totalOrderValue,
          createdAt: order.orderDate
        };
      }));
  
      // Trả về danh sách đơn hàng đã chuyển đổi
      return res.send(formattedOrderList);
    } catch (err) {
      // Xử lý lỗi nếu có
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).send('Lỗi server khi tải dữ liệu');
    }
}

let detailCustomerSide = async (req, res, next) => {
    let customerID = req.session.customerID;
    if (customerID === undefined) return res.status(400).send('Trường customerID không tồn tại');

    try {
        let customer = await User.findOne({ where: { userID: customerID, roleID: 2 } });
        if (customer == null) return res.status(400).send('User này không tồn tại');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }

    let orderID = req.params.orderID;
    if (orderID === undefined) return res.status(400).send('Trường orderID không tồn tại');

   let order;
   try { 
    order= await Order.findOne({
        where: { orderID, userID: customerID },
        include: [{
            model: ProductVariant,
            include: [Product] 
        } ,
        {
            model:User,
            include:[CustomerInfo]
        }]
    });

        if (order == null) return res.status(400).send('Order này không tồn tại');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }

    
    let orderState = order.orderState;
    let orderDate = order.orderDate; 

    // Chuyển đổi danh sách sản phẩm
    let orderItemList = order.productVariants.map(productVariant => {
        let product = productVariant.Product; // Lấy thông tin product từ productVariant
        return {
            // product_id: product.product_id, // Thêm product_id nếu cần
            name: product.name, // Lấy tên sản phẩm từ product
            quantity: productVariant.OrderItem.quantity,
            price: productVariant.OrderItem.price,
            colour: productVariant.Colour,
            size: productVariant.Size,
            totalValue: productVariant.OrderItem.totalValue
        };
    });
    

    // Chuyển đổi thông tin đơn hàng
    let orderConverted = {
        orderID: order.orderID,
        orderState: orderState, 
         
        orderDate,
        orderItems: orderItemList,
        totalProductValue: order.totalProductValue,
        deliveryCharges: order.deliveryCharges,
        totalOrderValue: order.totalOrderValue,
        customerName: order.User.CustomerInfo.name,
        email: order.User.CustomerInfo.email,
        phoneNumber: order.User.CustomerInfo.phoneNumber,
        shippingAddress: order.shippingAddress
    };

    return res.send(orderConverted);
};
let detailAdminSide = async (req, res, next) => {
    let orderID = req.params.orderID;
    if (orderID === undefined) return res.status(400).send('Trường orderID không tồn tại');
let order;
    try {
    order= await Order.findOne({
        where: { orderID },
        include: [{
            model: ProductVariant,
            include: [Product] 
        } ,
        {
            model:User,
            include:[CustomerInfo]
        }]
    });

        if (order == null) return res.status(400).send('Order này không tồn tại');

       
        let orderState = order.orderState;
        let orderDate = order.orderDate;

        

        // Chuyển đổi danh sách sản phẩm
        let orderItemList = order.productVariants.map(productVariant => {
            let product = productVariant.Product;
            let orderItem = productVariant.OrderItem;

            return {
                // product_id: product.product_id, // Thêm product_id nếu cần
                name: product.name,
                quantity: orderItem ? orderItem.quantity : 0,
                price: orderItem ? orderItem.price : 0,
                colour: productVariant.Colour, 
                size: productVariant.Size,    
                totalValue: orderItem ? orderItem.totalValue : 0
            };
        });

        // Chuyển đổi thông tin đơn hàng
        let orderConverted = {
            orderID: order.orderID,
            orderState: orderState, 
             
            orderDate,
            orderItems: orderItemList,
            totalProductValue: order.totalProductValue,
            deliveryCharges: order.deliveryCharges,
            totalOrderValue: order.totalOrderValue,
            customerName: order.User.CustomerInfo.name,
            email: order.User.CustomerInfo.email,
            phoneNumber: order.User.CustomerInfo.phoneNumber,
            shippingAddress: order.shippingAddress
        };

        return res.send(orderConverted);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
};

module.exports = {
    create,changeStatus,listAdminSide,listCustomerSide,detailCustomerSide,detailAdminSide
   
}