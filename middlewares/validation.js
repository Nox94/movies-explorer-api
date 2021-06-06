const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;

const validateMovieBody = celebrate({
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
});

const validateMovieObjectId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

const validateUsersBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateUserBodyBeforeCreation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(2).max(30),
  }),
});

const validateUsersBodyBeforeLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  validateMovieBody,
  validateMovieObjectId,
  validateUsersBody,
  validateUserBodyBeforeCreation,
  validateUsersBodyBeforeLogin,
};
