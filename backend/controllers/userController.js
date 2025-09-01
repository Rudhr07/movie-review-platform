const User = require('../models/User');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's reviews
    const reviews = await Review.find({ userId: req.params.id })
      .populate('movieId', 'title posterUrl')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get user's watchlist
    const watchlist = await Watchlist.find({ userId: req.params.id })
      .populate('movieId', 'title posterUrl averageRating')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ user, reviews, watchlist });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { username, email, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getWatchlist = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const watchlist = await Watchlist.find({ userId: req.params.id })
      .populate('movieId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Watchlist.countDocuments({ userId: req.params.id });
    
    res.json({
      watchlist: watchlist.map(item => item.movieId),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    next(error);
  }
};

exports.addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    
    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Check if already in watchlist
    const existingItem = await Watchlist.findOne({
      userId: req.user.id,
      movieId
    });
    
    if (existingItem) {
      return res.status(400).json({ message: 'Movie already in watchlist' });
    }
    
    const watchlistItem = await Watchlist.create({
      userId: req.user.id,
      movieId
    });
    
    res.status(201).json({ message: 'Added to watchlist', watchlistItem });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    
    const watchlistItem = await Watchlist.findOneAndDelete({
      userId: req.user.id,
      movieId
    });
    
    if (!watchlistItem) {
      return res.status(404).json({ message: 'Movie not found in watchlist' });
    }
    
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    next(error);
  }
};

exports.getUserReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ userId: req.params.id })
      .populate('movieId', 'title posterUrl releaseDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ userId: req.params.id });
    
    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    next(error);
  }
};