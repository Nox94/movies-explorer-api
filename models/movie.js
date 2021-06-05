const mongoose = require('mongoose');
const validator = require('validator');
const user = require('./user');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [
      validator.isURL,
      'Введена некорректная ссылка на постер к фильму.',
    ],
  },
  trailer: {
    type: String,
    required: true,
    validate: [
      validator.isURL,
      'Введена некорректная ссылка на трейлер фильма.',
    ],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [
      validator.isURL,
      'Введена некорректная ссылка на миниатюру постера.',
    ],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: user,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
