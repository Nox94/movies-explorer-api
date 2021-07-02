const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized'); // 401
const errorMessagesText = require('../utils/errorMessagesText');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');
  if (!token) {
    return next(new Unauthorized(errorMessagesText.authNecessityText));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new Unauthorized(errorMessagesText.authNecessityText));
  }
  req.user = payload;
  return next();
};
