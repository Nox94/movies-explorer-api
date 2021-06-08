const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest'); // 400
const Unauthorized = require('../errors/Unauthorized'); // 401
const NotFound = require('../errors/NotFound'); // 404
const Conflict = require('../errors/Conflict '); // 409

module.exports.login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  //   console.log(req.body);
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new BadRequest('Неправильные почта или пароль'));
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          // boolean
          if (!matched) {
            return next(new BadRequest('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            {
              expiresIn: '7d',
            },
          );
          res.status(200).send({ _id: user._id, token });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'BadRequest') {
        next(new BadRequest('Введены некорректные данные при попытке авторизоваться.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash, // хеш записан в базу
    }).then((user) => res.status(201).send(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest(
            'Переданы некорректные данные при создании пользователя.',
          ),
        );
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(
          new Conflict('Пользователь с таким Email уже зарегистрирован.'),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getUsersProfileInfo = (req, res, next) => User.findOne({ _id: req.user._id })
  .then((user) => {
    if (!user) {
      throw new Unauthorized('Необходима авторизация.');
    } else {
      res.send(user);
    }
  })
  .catch(next);

module.exports.updateUsersProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь по указанному id не найден.'));
      } else {
        res.status(200).send(user);
      }
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest(
            'Переданы некорректные данные при обновлении профиля.',
          ),
        );
      } else {
        next(err);
      }
    });
};
