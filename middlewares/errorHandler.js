const errorMessagesText = require('../utils/errorMessagesText');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? errorMessagesText.serverErrorText : message,
  });
  next();
};
module.exports = errorHandler;
