const express = require('express');
const { 
  getMovies, 
  getMovie, 
  addMovie,
  updateMovie,
  deleteMovie,
  getMovieReviews,
  addMovieReview,
  searchMovies,
  getGenres
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Movie routes
router.get('/', getMovies);
router.get('/search', searchMovies);
router.get('/genres', getGenres);
router.get('/:id', getMovie);
router.post('/', protect, admin, addMovie);
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);

// Review routes for movies
router.get('/:id/reviews', getMovieReviews);
router.post('/:id/reviews', protect, addMovieReview);

module.exports = router;