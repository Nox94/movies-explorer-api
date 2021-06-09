const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;
const errorMessagesText = require('../utils/errorMessagesText');

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required().integer().min(2),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2).max(200),
    image: Joi.string()
      .required().custom((value, helpers) => {
        const isValid = validator.isURL(value, { require_protocol: true });
        if (isValid) {
          return value;
        }
        return helpers.message(errorMessagesText.incorrectImageLinkText);
      }),
    trailer: Joi.string()
      .required().custom((value, helpers) => {
        const isValid = validator.isURL(value, { require_protocol: true });
        if (isValid) {
          return value;
        }
        return helpers.message(errorMessagesText.incorrectTrailerLinkText);
      }),
    nameRU: Joi.string().required().min(2).max(50)
      .regex(/^[А-ЯЁ][а-яё]+$/),
    nameEN: Joi.string().required().min(2).max(50)
      .regex(/^[a-zA-Z]+$/),
    thumbnail: Joi.string()
      .required().custom((value, helpers) => {
        const isValid = validator.isURL(value, { require_protocol: true });
        if (isValid) {
          return value;
        }
        return helpers.message(errorMessagesText.incorrectThumbnailLinkText);
      }),
    movieId: Joi.number().required().min(1),
  }),
});

const validateMovieObjectId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message(errorMessagesText.invalidIdText);
    }),
  }),
});

const validateUsersBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
});

const validateUserBodyBeforeCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
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
