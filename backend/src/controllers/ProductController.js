const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const Product = require("../models/product");
const Category = require("../models/category");
const Sequelize = require("sequelize");
const ProductVariant = require("../models/productVariant");
const ProductPicture = require("../models/productPicture");
const uploadPicture = require("../middlewares/uploadPicture");

let create = async (req, res, next) => {
    uploadPicture(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }

        // Kiểm tra các trường dữ liệu product
        let name = req.body.name;
        if (name === null || name === undefined || name.trim() === "") {
            return res.status(400).send("Trường name không được rỗng");
        }

        let categoryID = parseInt(req.body.categoryID);
        if (categoryID === undefined || isNaN(categoryID)) {
            return res.status(400).send("Trường categoryID không hợp lệ");
        }

        let price = parseFloat(req.body.price);
        if (price === undefined || isNaN(price)) {
            return res.status(400).send("Trường price không hợp lệ");
        }
        let description = req.body.description || "";

        try {
            // Tạo product mới
            let newProduct = await Product.create({
                name,
                description,
                categoryID,
                price,
            });

            // Lấy danh sách ảnh đã tải lên từ middleware uploadImage
            let files = req.files;

            // Xử lý các ảnh đã tải lên (nếu có)
            if (files && files.length > 0) {
                for (let file of files) {
                    let data = {
                        path:
                            "http://localhost:/static/images/" + file.filename, // Lấy filename từ middleware
                        productID: newProduct.productID, // Liên kết hình ảnh với productID
                    };
                    await ProductPicture.create(data);
                }
            }
            return res.send(newProduct);
        } catch (err) {
            console.log(err);
            return res
                .status(500)
                .send("Gặp lỗi khi tạo dữ liệu vui lòng thử lại");
        }
    });
};

let update = async (req, res, next) => {
    uploadPicture(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send(err);
        }

        // Lấy thông tin từ request body
        let productID = parseInt(req.body.productID);
        let name = req.body.name;
        let categoryID = parseInt(req.body.categoryID);
        let price = parseFloat(req.body.price);
        let description = req.body.description || "";
        let files = req.files;

        // Kiểm tra các trường dữ liệu productID, name, categoryID, price
        if (productID === undefined || isNaN(productID)) {
            return res.status(400).send("Trường productID không hợp lệ");
        }
        if (name === undefined || name.trim() === "") {
            return res.status(400).send("Trường name không hợp lệ");
        }
        if (categoryID === undefined || isNaN(categoryID)) {
            return res.status(400).send("Trường categoryID không hợp lệ");
        }
        if (price === undefined || isNaN(price)) {
            return res.status(400).send("Trường price không hợp lệ");
        }

        try {
            // Tìm sản phẩm
            let category = await Category.findOne({ where: { categoryID } });
            if (category == null)
                return res.status(400).send("Danh mục này không tồn tại");
            let product = await Product.findOne({
                where: { productID: productID },
                include: {
                    model: ProductPicture,
                    attributes: ["productPictureID", "path"],
                },
            });

            if (!product) {
                return res.status(400).send("Sản phẩm này không tồn tại");
            }
            // Xóa ảnh cũ của sản phẩm
            const directoryPath = path.join(__basedir, "public", "images");
            for (let {
                productPictureID,
                path: picturePath,
            } of product.ProductPictures) {
                // Sử dụng productPictureID
                const fileName = picturePath.slice(-40);
                const filePath = path.join(directoryPath, fileName);

                // Xóa file ảnh trên ổ đĩa
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                // Xóa bản ghi ảnh trong database
                await ProductPicture.destroy({ where: { productPictureID } }); // Sử dụng productPictureID
            }

            // Cập nhật thông tin sản phẩm
            await product.update({ name, categoryID, description, price });

            // Xử lý ảnh mới (nếu có)
            if (files && files.length > 0) {
                for (let file of files) {
                    let fileName = file.path.slice(-40, file.path.length);
                    let path =
                        "http://localhost:3000/static/images/" + fileName;
                    await ProductPicture.create({
                        path,
                        productID: productID, // Liên kết hình ảnh với productID
                    });
                }
            }

            return res.send("Success");
        } catch (err) {
            console.log(err);
            return res
                .status(500)
                .send("Gặp lỗi khi cập nhật dữ liệu vui lòng thử lại");
        }
    });
};

let listAdminSide = async (req, res, next) => {
    let listProductVariant = await ProductVariant.findAll({
        attributes: [
            "productVariantID",
            "quantity",
            "created_at",
            "Colour",
            "Size",
        ],
        include: [
            {
                model: Product,
                attributes: ["productID", "name", "price"],
                include: [{ model: ProductPicture, attributes: ["path"] }],
            },
        ],
        order: [["created_at", "DESC"]],
    });
    listProductVariant = listProductVariant.map((productVariant) => {
        let newProductVariant = {
            productID: productVariant.Product.productID,
            productVariantID: productVariant.productVariantID,
            name: productVariant.Product.name,
            colour: productVariant.Colour,
            size: productVariant.Size,
            productPicture:
                productVariant.Product.ProductPictures?.[0]?.path || null,
            price: productVariant.Product.price,
            quantity: productVariant.quantity,

            created_at: productVariant.created_at,
        };
        return newProductVariant;
    });
    return res.send(listProductVariant);
};
let listCustomerSide = async (req, res, next) => {
    let categoryID = Number(req.query.category);
    let whereClause = {};

    if (categoryID != undefined && Number.isInteger(categoryID)) {
        whereClause.categoryID = categoryID;
    }

    try {
        // Lấy danh sách tất cả sản phẩm ưu tiên sản phẩm mới nhất
        let listProduct = await Product.findAll({
            attributes: ["productID"],
            where: whereClause,
            order: [["created_at", "DESC"]],
            raw: true,
        });

        let listProductVariant = [];

        // Duyệt qua danh sách sản phẩm
        for (let { productID } of listProduct) {
            // Lấy danh sách tất cả các màu của sản phẩm đó
            let listColor = await ProductVariant.findAll({
                attributes: ["Colour"],
                where: { productID },
                group: ["Colour"],
                raw: true,
            });

            // Duyệt qua danh sách màu
            for (let { Colour } of listColor) {
                // Tìm biến thể sản phẩm có cùng màu với nhau
                let listProductVariantSameColour = await ProductVariant.findAll(
                    {
                        attributes: [
                            "productVariantID",
                            "Colour",
                            "Size",
                            "quantity",
                        ],
                        include: [
                            {
                                model: Product,
                                attributes: [
                                    "productID",
                                    "name",
                                    "rating",
                                    "sold",
                                    "reviewQuantity",
                                ],
                                include: {
                                    model: ProductPicture,
                                    attributes: ["path"],
                                },
                                where: whereClause,
                            },
                        ],
                        where: {
                            [Op.and]: [
                                { Colour }, // Sử dụng Colour (chuỗi) để lọc

                                { quantity: { [Op.gt]: 0 } },
                            ],
                        },
                    }
                );

                // Chuyển đổi dữ liệu
                if (listProductVariantSameColour.length) {
                    let productVariant = {
                        productID:
                            listProductVariantSameColour[0].Product.productID,
                        productName:
                            listProductVariantSameColour[0].Product.name,
                        rating: listProductVariantSameColour[0].Product.rating,
                        sold: listProductVariantSameColour[0].Product.sold,
                        reviewQuantity:
                            listProductVariantSameColour[0].Product
                                .reviewQuantity,
                        productVariantID:
                            listProductVariantSameColour[0].productVariantID,
                        colourName: listProductVariantSameColour[0].Colour,
                        price: listProductVariantSameColour[0].Product.price,
                        productPicture:
                            listProductVariantSameColour[0].Product
                                .ProductPictures[0]?.path || null,
                        sizes: [],
                    };

                    // Duyệt qua danh sách biến thể sản phẩm có cùng màu để cộng dồn danh sách sizes
                    for (let { Size } of listProductVariantSameColour) {
                        productVariant.sizes.push(Size);
                    }
                    listProductVariant.push(productVariant);
                }
            }
        }

        return res.send(listProductVariant);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
    }
};

let detailCustomerSide = async (req, res, next) => {
    let productID = req.params.productID;
    if (productID === undefined)
        return res.status(400).send("Trường productID không tồn tại");

    try {
        let productDetail = await Product.findOne({
            attributes: [
                "productID",
                "name",
                "description",
                "rating",
                "sold",
                "price",
            ],
            where: { productID },
            raw: true,
        });
        return res.send(productDetail);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
    }
};
let detailAdminSide = async (req, res, next) => {
    let productID = req.params.productID;
    if (productID === undefined)
        return res.status(400).send("Trường productID không tồn tại");

    try {
        let productDetail = await Product.findOne({
            attributes: [
                "productID",
                "name",
                "categoryID",
                "description",
                "price",
            ],
            include: [
                { model: Category, attributes: ["name"] },

                {
                    model: ProductVariant,
                    attributes: [
                        "productVariantID",
                        "Colour",
                        "Size",
                        "quantity",
                    ],
                },
                { model: ProductPicture, attributes: ["path"] },
            ],
            where: { productID },
        });

        if (productDetail) {
            let productPictures = productDetail.ProductPictures.map(
                ({ path }) => {
                    return { path };
                }
            );
            let productVariantList = productDetail.productVariants.map(
                (productVariant) => {
                    return {
                        productVariantID: productVariant.productVariantID,

                        colour: productVariant.colour,

                        size: productVariant.size,
                        quantity: productVariant.quantity,
                    };
                }
            );
            productDetail = {
                productID: productDetail.productID,
                name: productDetail.name,
                categoryID: productDetail.categoryID,
                CategoryName: productDetail.Category.name,
                price: productDetail.price,
                description: productDetail.description,
                productVariantList: productVariantList,
                productPictures: productPictures,
            };
            return res.send(productDetail);
        } else {
            return res.status(400).send("Biến thể sản phẩm này không tồn tại");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
    }
};
let listColour = async (req, res, next) => {
    let productID = req.params.productID;
    if (productID === undefined) {
        return res.status(400).send("Trường productID không tồn tại");
    }

    try {
        let listColour = await ProductVariant.findAll({
            attributes: [
                [Sequelize.fn("DISTINCT", Sequelize.col("Colour")), "Colour"],
            ], // Lấy danh sách các màu duy nhất
            where: { productID },
        });

        listColour = listColour.map((item) => item.get("Colour")); // Chuyển đổi thành mảng các màu

        return res.send(listColour);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
    }
};

let listSize = async (req, res, next) => {
    let productID = parseInt(req.params.productID);
    let Colour = req.params.Colour; // Không cần parseInt vì Colour là chuỗi

    if (productID === undefined || isNaN(productID)) {
        return res.status(400).send("Trường productID không hợp lệ");
    }
    if (Colour === undefined || Colour.trim() === "") {
        // Kiểm tra Colour rỗng
        return res.status(400).send("Trường Colour không hợp lệ");
    }

    try {
        let listSize = await ProductVariant.findAll({
            attributes: [
                [Sequelize.fn("DISTINCT", Sequelize.col("Size")), "Size"], // Lấy danh sách size duy nhất
            ],
            where: { productID, Colour },
        });

        listSize = listSize.map((item) => item.get("Size")); // Chuyển đổi thành mảng size

        return res.send(listSize);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Gặp lỗi khi tải dữ liệu vui lòng thử lại");
    }
};

module.exports = {
    create,
    update,
    listAdminSide,
    listCustomerSide,
    detailAdminSide,
    detailCustomerSide,
    listColour,
    listSize,
};
