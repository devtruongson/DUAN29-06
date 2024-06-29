const Product = require('../models/product');
const ProductVariant = require('../models/productVariant');
const ProductPicture = require('../models/productPicture')

let create = async (req, res, next) => {
    
        let quantity = parseInt(req.body.quantity);
        if (quantity === undefined) return res.status(400).send('Trường quantity không tồn tại');
        let productID = parseInt(req.body.productID);
        if (productID === undefined) return res.status(400).send('Trường productID không tồn tại');
        let Colour = req.body.Colour;
        if (Colour === undefined) return res.status(400).send('Trường colour không tồn tại');
        let Size = req.body.Size;
        if (Size === undefined) return res.status(400).send('Trường size không tồn tại');
        

        try {
            let data = {
                quantity,
                productID,
                Colour,
                Size
            };
            let newProductVariant = await ProductVariant.create(data);
            
            
            return res.send(newProductVariant)
        } catch (err) {
            console.log(err);
            return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
        }
    
}


  let updateQuantity = async (req, res, next) => {
    try {
        let productVariantID = req.body.productVariantID;
        if (productVariantID === undefined) return res.status(400).send('Trường productVariantID không tồn tại');
        let newQuantity = req.body.quantity;
        if (newQuantity === undefined) return res.status(400).send('Trường quantity không tồn tại');
  
        await ProductVariant.update(
            { quantity: newQuantity },
            { where: { productVariantID: productVariantID } }
        )
        return res.send({ message: 'Cập nhật tồn kho cho sản phẩm thành công!' })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
  }
  const deleteProductVariant = async (req, res, next) => {
    try {
      const productVariantID = parseInt(req.params.productVariantID); // Lấy ID từ params
  
      if (isNaN(productVariantID)) {
        return res.status(400).send('productVariantID không hợp lệ');
      }
  
      const deletedRowCount = await ProductVariant.destroy({
        where: { productVariantID },
      });
  
      if (deletedRowCount === 0) {
        return res.status(404).send('Không tìm thấy Product Variant với ID này');
      }
  
      return res.send({ message: 'Product Variant đã được xóa thành công' });
    } catch (err) {
      console.error('Lỗi khi xóa Product Variant:', err);
      return res.status(500).send('Đã xảy ra lỗi khi xóa Product Variant');
    }
  };
  let detailCustomerSide = async (req, res, next) => {
    let productID = req.params.productID;
    if (productID === undefined) return res.status(400).send('Trường productID không tồn tại');
    let Colour = req.params.Colour;
    if (Colour === undefined) return res.status(400).send('Trường colour không tồn tại');
    let Size = req.params.Size;
    if (Size === undefined) return res.status(400).send('Trường size không tồn tại');

    try {
        let productVariant = await ProductVariant.findOne({
            attributes: ['productVariantID', 'quantity'],
            include: [
                {
                    model: Product,
                    attributes: ['productID', 'price'],
                    // Truy vấn ảnh từ Product:
                    include: [
                        { model: ProductPicture, attributes: ['path'] } 
                    ]
                },
            ],
            where: { productID, Colour, Size },
        });

        // Lấy danh sách ảnh của sản phẩm
        let productPictures = productVariant.Product.ProductPictures.map(({ path }) => ({ path })); 

        let newProductVariant = {
            productVariantID: productVariant.productVariantID,
            price: productVariant.Product.price,
            quantity: productVariant.quantity,
            productPictures: productPictures // Thêm vào kết quả
        };

        return res.send(newProductVariant);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
};

  
  module.exports ={
    create,updateQuantity,deleteProductVariant,detailCustomerSide
  }