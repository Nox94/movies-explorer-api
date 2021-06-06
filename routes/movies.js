const router = require('express').Router();

const { validateMovieBody, validateMovieObjectId } = require('../middlewares/validation');

const {
  getAllUsersMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

router.get('/', getAllUsersMovies);
router.post('/', validateMovieBody, createMovie);
router.delete('/:_id', validateMovieObjectId, deleteMovieById);

module.exports = router;
