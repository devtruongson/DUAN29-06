const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('../models/user');
const CustomerInfo = require('../models/customerInfo');

let register = async (req, res, next) => {
    let email = req.body.email;
    if (email === undefined) return res.status(400).send('Trường email không tồn tại');
    let password = req.body.password;
    if (password === undefined) return res.status(400).send('Trường password không tồn tại');
    let name = req.body.name;
    if (name === undefined) return res.status(400).send('Trường name không tồn tại');
    let phoneNumber = req.body.phoneNumber;
    if (phoneNumber === undefined) return res.status(400).send('Trường phoneNumber không tồn tại');
    let address = req.body.address;
    if (address === undefined) return res.status(400).send('Trường address không tồn tại');

    let customer = await User.findOne({ where: { email, roleID: 2 } });
    if (customer) return res.status(409).send("Email đã tồn tại");
    else {
        try {
            let hashPassword = bcrypt.hashSync(password, 10);
            let newCustomer = await User.create({ email: email, password: hashPassword, roleID: 2 });
            let newCustomerInfo = await CustomerInfo.create({ userID: newCustomer.userID, name, phoneNumber, address });

            req.session.customerID = newCustomer.userID;
            req.session.email = newCustomer.email;

            return res.send({
                customerID: newCustomer.userID,
                email: newCustomer.email,
                name: newCustomerInfo.name,
                phoneNumber: newCustomerInfo.phoneNumber,
                address: newCustomerInfo.address
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send("Có lỗi trong quá trình tạo tài khoản vui lòng thử lại");
        }
    }
}

let login = async (req, res, next) => {
    let email = req.body.email;
    if (email === undefined) return res.status(400).send({ message: 'Email hoặc Mật khẩu không đúng' });
    let password = req.body.password;
    if (password === undefined) return res.status(400).send({ message: 'Email hoặc Mật khẩu không đúng' });

    try {
        let customer = await User.findOne({
            where: { email, roleID: 2 },
            include: [{ model: CustomerInfo, attributes: ['name', 'phoneNumber', 'address'] }],
        });
        if (!customer) {
            return res.status(401).send({ message: 'Email hoặc Mật khẩu không đúng' });
        }

        let isPasswordValid = bcrypt.compareSync(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Email hoặc Mật khẩu không đúng' });
        }
        // Tạo session khi đăng nhập thành công
        req.session.customerID = customer.userID;
        req.session.email = customer.email;

        return res.send({
            customerID: customer.userID, // Gửi về id của khách hàng
            email: customer.email,
            name: customer.CustomerInfo.name,
            phoneNumber: customer.CustomerInfo.phoneNumber,
            address: customer.CustomerInfo.address
        }); // Trả về thông tin khách hàng sau khi đăng nhập thành công
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Có lỗi xảy ra, vui lòng thử lại' });
    }
};
let logout = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error('Lỗi khi hủy session:', err);
                return res.status(500).send({ message: 'Có lỗi xảy ra khi đăng xuất' });
            }
            res.send({ message: 'Đăng xuất thành công' });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Có lỗi xảy ra, vui lòng thử lại' });
    }
};
let getInfor = async (req, res, next) => {
    console.log(req.session)
    const customerID = req.session.customerID;
    if (!customerID) return res.status(401).send({ message: 'Chưa đăng nhập' }); // Kiểm tra xem khách hàng có đang đăng nhập hay không

    try {
        const customer = await User.findOne({
            where: { userID: customerID, roleID: 2 },
            include: [
                { model: CustomerInfo, attributes: ['name', 'phoneNumber', 'address'] },
            ]
        });

        return res.send({
            email: customer.email,
            name: customer.CustomerInfo.name,
            phoneNumber: customer.CustomerInfo.phoneNumber,
            address: customer.CustomerInfo.address,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Có lỗi xảy ra, vui lòng thử lại' });
    }
};
let update = async (req, res, next) => {
    const customerID = req.session.customerID; // Lấy customer_id từ session
    if (!customerID) return res.status(401).send({ message: 'Chưa đăng nhập' }); // Kiểm tra xem khách hàng có đang đăng nhập hay không
    let name = req.body.name;
    if (name === undefined) return res.status(400).send('Trường name không tồn tại');
    let phoneNumber = req.body.phoneNumber;
    if (phoneNumber === undefined) return res.status(400).send('Trường phoneNumber không tồn tại');
    let address = req.body.address;
    if (address === undefined) return res.status(400).send('Trường address không tồn tại');

    try {
        let customer = await User.findOne({ where: { userID: customerID, roleID: 2 } });
        if (!customer) return res.status(409).send("Customer không tồn tại");

        let numberUpdate = await CustomerInfo.update(
            { name, phoneNumber, address },
            { where: { userID: customerID } }
        )
        if (numberUpdate) {
            return res.send({
                name,
                phoneNumber,
                address
            });
        } else {
            return res.status(400).send("Có lỗi trong quá trình cập nhật vui lòng thử lại");
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send("Có lỗi trong quá trình cập nhật vui lòng thử lại");
    }
}

module.exports = {
    register,
    login,
    logout,
    getInfor,
    update
};