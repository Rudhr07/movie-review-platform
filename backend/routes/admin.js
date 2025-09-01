const express = require('express');
const { protect, admin } = require('../middleware/auth');
const { getStats, getUsers, getRecentReviews, deleteUser, toggleFeaturedMovie } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, admin); // All admin routes protected

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/reviews/recent', getRecentReviews);
router.delete('/users/:id', deleteUser);
router.patch('/movies/:id/feature', toggleFeaturedMovie);

module.exports = router;