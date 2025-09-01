const express = require('express');
const { getUserProfile, updateProfile, getWatchlist, addToWatchlist, removeFromWatchlist, getUserReviews } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/:id', protect, updateProfile);
router.get('/:id/watchlist', getWatchlist);
router.post('/:id/watchlist', protect, addToWatchlist);
router.delete('/:id/watchlist/:movieId', protect, removeFromWatchlist);
router.get('/:id/reviews', getUserReviews);

module.exports = router;