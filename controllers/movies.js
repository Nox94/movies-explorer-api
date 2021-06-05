const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest'); // 400
const Forbidden = require('../errors/Forbidden'); // 403
const NotFound = require('../errors/NotFound'); // 404

// возвращает все сохранённые пользователем фильмы
// GET /movies
module.exports.getAllMovies = (req, res, next) => {
  Movie.find({}).then((movies) => {
    if (!movies) {
      next(new NotFound('Фильмы не найдены.'));
    } else {
      res.send(movies);
    }
  }).catch(next);
};

// создаёт фильм с переданными в теле данными
// POST /movies
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
  }).then((movie) => res.status(201).send(movie).catch((err) => next(err)));
};
// удаляет сохранённый фильм по id
// DELETE /movies/movieId
module.exports.deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie.findById(movieId).then((movie) => {
    if (!movie) {
      next(new NotFound('Фильм с таким id не найден'));
    } else if (movie.owner._id.toString() !== userId) {
      next(new Forbidden('Нельзя удалить фильм из чужой подборки.'));
    } else {
      Movie.findByIdAndRemove(movieId).then((video) => {
        if (!video) {
          next(new NotFound('Фильм не найден.'));
        } else {
          res.send('Фильм успешно удален.');
        }
      }).catch((err) => {
        if (err.name === 'BadRequestError') {
          next(new BadRequest('Введены некорректные данные.'));
        } else {
          next(err);
        }
      });
    }
  }).catch(next);
};
