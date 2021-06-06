const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(2).max(30),
    }),
  }),
  login,
);
router.use(auth);
router.use('/users', users);
router.use('/movies', movies);

router.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена.'));
});
module.exports = router;
