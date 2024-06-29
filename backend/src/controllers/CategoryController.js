const Category = require('../models/category');

let create = async (req, res, next) => {
    try {
        
        let name = req.body.name;
        if (name === undefined) return res.status(400).send('Trường name không tồn tại');
        let description = req.body.description|| '';
       
        let category = await Category.findOne({ where: { name } });
        if (category) return res.status(409).send(' Danh mục đã tồn tại');
        else {
            let newCategory = await Category.create({ name:name,description:description  });
            return res.send(newCategory);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
}
let list = async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        attributes: ['categoryID', 'name', 'description'],
        raw: true
      });
  
      res.send(categories);
    } catch (err) {
      console.log(err)
      return res.status(500).send('Gặp lỗi khi tải dữ liệu vui lòng thử lại');
    }
  }
  let update = async (req, res, next) => {
    let categoryID = req.body.categoryID;
    if (categoryID === undefined) return res.status(400).send('Trường categoryID không tồn tại');
    let name = req.body.name;
    if (name === undefined) return res.status(400).send('Trường name không tồn tại');
    let description = req.body.description ||'';
    
    
    try {
        let category = await Category.findOne({ where: { categoryID } });
        if (!category) return res.status(409).send("Danh mục không tồn tại");

        let numberUpdate = await Category.update(
            { name, description },
            { where: { categoryID } }
        )
        if (numberUpdate) {
            return res.send({
                name,
                description
            });
        } else {
            return res.status(400).send("Có lỗi trong quá trình cập nhật vui lòng thử lại");
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send("Có lỗi trong quá trình cập nhật vui lòng thử lại");
    }
}
let deleteCategory = async (req, res, next) => {
  try {
      const categoryID = req.body.categoryID; // Lấy id của danh mục cần xóa từ đường dẫn URL

      // Tìm danh mục cần xóa
      const category = await Category.findByPk(categoryID);

      // Nếu không tìm thấy danh mục
      if (!category) {
          return res.status(404).send('Không tìm thấy danh mục');
      }

      // Xóa danh mục
      await category.destroy();

      return res.send('Xóa danh mục thành công');
  } catch (err) {
      console.log(err);
      return res.status(500).send('Gặp lỗi khi xóa danh mục');
  }
}
  
  

module.exports = {
    create,list,update,deleteCategory
}