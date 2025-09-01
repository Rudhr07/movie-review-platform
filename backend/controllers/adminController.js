const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');

// GET /api/admin/stats - basic platform stats
exports.getStats = async (req, res, next) => {
	try {
		const [userCount, movieCount, reviewCount] = await Promise.all([
			User.countDocuments(),
			Movie.countDocuments(),
			Review.countDocuments()
		]);
		res.json({ userCount, movieCount, reviewCount });
	} catch (e) { next(e); }
};

// GET /api/admin/users - list users (paginated)
exports.getUsers = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page)||1;
		const limit = parseInt(req.query.limit)||20;
		const skip = (page-1)*limit;
		const [users, total] = await Promise.all([
			User.find().select('-password').sort({createdAt:-1}).skip(skip).limit(limit),
			User.countDocuments()
		]);
		res.json({ users, currentPage:page, totalPages: Math.ceil(total/limit), totalUsers: total });
	} catch (e) { next(e); }
};

// GET /api/admin/reviews/recent - latest reviews
exports.getRecentReviews = async (req, res, next) => {
	try {
		const limit = parseInt(req.query.limit)||10;
		const reviews = await Review.find()
			.populate('userId','username')
			.populate('movieId','title')
			.sort({createdAt:-1})
			.limit(limit);
		res.json({ reviews });
	} catch (e) { next(e); }
};

// DELETE /api/admin/users/:id - remove user (except self)
exports.deleteUser = async (req, res, next) => {
	try {
		if (req.params.id === req.user.id) {
			return res.status(400).json({ message: 'Cannot delete your own account' });
		}
		const deleted = await User.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ message: 'User not found' });
		res.json({ message: 'User deleted' });
	} catch (e) { next(e); }
};

// PATCH /api/admin/movies/:id/feature - toggle featured flag
exports.toggleFeaturedMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id);
		if (!movie) return res.status(404).json({ message: 'Movie not found' });
		movie.featured = !movie.featured;
		await movie.save();
		res.json({ featured: movie.featured });
	} catch (e) { next(e); }
};
