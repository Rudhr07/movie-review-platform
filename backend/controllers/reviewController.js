const Review = require('../models/Review');
const Movie = require('../models/Movie');

// Get all reviews for a specific movie
exports.getReviewsForMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const reviews = await Review.find({ movieId: movieId }).populate('userId', 'username profilePicture');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Add a review for a specific movie
exports.addReviewForMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const { rating, reviewText } = req.body;
    const userId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      userId: userId,
      movieId: movieId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    // Create review
    const review = new Review({
      userId: userId,
      movieId: movieId,
      rating,
      reviewText,
    });
    await review.save();

    // Update movie's average rating and rating count
    await updateMovieRating(movieId);

    const populatedReview = await Review.findById(review._id).populate('userId', 'username profilePicture');
    res.status(201).json(populatedReview);
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ movieId: req.params.movieId });
    
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

exports.addReview = async (req, res, next) => {
  try {
    const { rating, reviewText } = req.body;
    const movieId = req.params.movieId;
    
    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      userId: req.user.id,
      movieId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }
    
    const review = await Review.create({
      userId: req.user.id,
      movieId,
      rating,
      reviewText
    });
    
    // Update movie rating
    await updateMovieRating(movieId);
    
    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'username profilePicture');
    
    res.status(201).json(populatedReview);
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { rating, reviewText } = req.body;
    
    const review = await Review.findOne({
      _id: req.params.reviewId,
      userId: req.user.id
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.rating = rating;
    review.reviewText = reviewText;
    review.isEdited = true;
    
    await review.save();
    
    // Update movie rating
    await updateMovieRating(review.movieId);
    
    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'username profilePicture');
    
    res.json(populatedReview);
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      userId: req.user.id
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const movieId = review.movieId;
    await Review.findByIdAndDelete(req.params.reviewId);
    
    // Update movie rating
    await updateMovieRating(movieId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.likeReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const hasLiked = review.likes.includes(req.user.id);
    
    if (hasLiked) {
      // Unlike
      review.likes = review.likes.filter(
        userId => userId.toString() !== req.user.id
      );
    } else {
      // Like
      review.likes.push(req.user.id);
    }
    
    await review.save();
    
    res.json({ likes: review.likes.length, hasLiked: !hasLiked });
  } catch (error) {
    next(error);
  }
};

// Helper function to update movie rating
async function updateMovieRating(movieId) {
  const reviews = await Review.find({ movieId });
  
  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: 0,
      ratingCount: 0
    });
    return;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  await Movie.findByIdAndUpdate(movieId, {
    averageRating: parseFloat(averageRating.toFixed(1)),
    ratingCount: reviews.length
  });
}