const express = require('express');
const { getReviewsForMovie, addReviewForMovie } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { reviewLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Get all reviews for a movie
router.get('/:id', getReviewsForMovie);

// Add a review for a movie (requires authentication)
router.post('/:id', reviewLimiter, protect, addReviewForMovie);

module.exports = router;

