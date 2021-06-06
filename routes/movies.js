const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getAllUsersMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

router.get('/movies', getAllUsersMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required().min(2).max(3),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2).max(200),
    image: Joi.string()
      .required().custom((value, helpers) => {
        const isValid = validator.isURL(value, { require_protocol: true });
        if (isValid) {
          return value;
        }
        return helpers.message('Введены некорректные данные ссылки на изображение.');
      }),
    trailer: Joi.string()
      .required().custom((value, helpers) => {
        const isValid = validator.isURL(value, { require_protocol: true });
        if (isValid) {
          return value;
        }
        return helpers.message('Введены некорректные данные ссылки на трейлер.');
      }),
    nameRU: Joi.string().required().min(2).max(50)
      .regex(/^[А-ЯЁ][а-яё]*$/),
    nameEN: Joi.string().required().min(2).max(50)
      .regex(/^[a-zA-Z]*$/),
    thumbnail: Joi.string()
      .required().custom((value, helpers) => {
        const isValid = validator.isURL(value, { require_protocol: true });
        if (isValid) {
          return value;
        }
        return helpers.message('Введены некорректные данные ссылки на миниатюру изображения.');
      }),
    movieId: Joi.number().required().min(1),
  }),
}), createMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required().min(1),
  }),
}), deleteMovieById);

module.exports = router;
