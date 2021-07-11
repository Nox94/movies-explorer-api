const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest'); // 400
const Forbidden = require('../errors/Forbidden'); // 403
const NotFound = require('../errors/NotFound'); // 404
const errorMessagesText = require('../utils/errorMessagesText');

module.exports.getAllUsersMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (!movies) {
        return next(new NotFound(errorMessagesText.notFoundMoviesText));
      }
      return res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie)
      .catch((err) => next(err)));
};

module.exports.deleteMovieById = (req, res, next) => {
  const { _id } = req.params;
  const userId = req.user._id;
  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFound(errorMessagesText.notFoundMovieByIdText));
      }
      if (movie.owner._id.toString() !== userId) {
        return next(new Forbidden(errorMessagesText.notYourMovieText));
      }
      return Movie.remove()
        .then((video) => {
          if (!video) {
            return next(new NotFound(errorMessagesText.notFoundMovieText));
          }
          return res.send(errorMessagesText.succesfullRemovingText);
        })
        .catch((err) => {
          if (err.name === 'BadRequestError') {
            return next(new BadRequest(errorMessagesText.incorrectDataText));
          }
          return next(err);
        });
    })
    .catch(next);
};
