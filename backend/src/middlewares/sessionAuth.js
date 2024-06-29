function sessionAuth(req, res, next) {
  console.log(req.session)
  if (!req.session.customerID) {
    return res.status(401).send({ message: 'Chưa đăng nhập' });
  }
  next();
}

module.exports = sessionAuth;