const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized'); // 401

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  if (!token) {
    next(new Unauthorized('Необходима авторизация.'));
  } else {
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      next(new Unauthorized('Необходима авторизация.'));
    }
    req.user = payload;
    next();
  }
};
