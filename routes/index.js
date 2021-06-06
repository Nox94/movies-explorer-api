const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');
const users = require('./users');
const movies = require('./movies');
const { validateUserBodyBeforeCreation, validateUsersBodyBeforeLogin } = require('../middlewares/validation');

router.post(
  '/signup',
  validateUserBodyBeforeCreation,
  createUser,
);
router.post(
  '/signin',
  validateUsersBodyBeforeLogin,
  login,
);
router.use(auth);
router.use('/users', users);
router.use('/movies', movies);

router.use('*', (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена.'));
});
module.exports = router;
