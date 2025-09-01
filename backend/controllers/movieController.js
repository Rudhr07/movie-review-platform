const Movie = require('../models/Movie');
const Review = require('../models/Review');
const { fetchMovieDetails, getImageUrl } = require('../utils/tmdbAPI');

// Helper function to add TMDB image URLs to movie data
const addImageUrls = (movie) => {
  return {
    ...movie.toObject(),
    posterUrl: movie.posterPath ? getImageUrl(movie.posterPath) : '',
    backdropUrl: movie.backdropPath ? getImageUrl(movie.backdropPath, 'w1280') : ''
  };
};

// GET /movies - Retrieve all movies (with pagination and filtering)
exports.getMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build query object for filtering
    let query = {};
    
    // Filter by genre
    if (req.query.genre) {
      query.genres = { $in: [req.query.genre] };
    }
    
    // Filter by year
    if (req.query.year) {
      const year = parseInt(req.query.year);
      query.releaseDate = {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31)
      };
    }
    
    // Filter by rating
    if (req.query.minRating) {
      query.localRating = { $gte: parseFloat(req.query.minRating) };
    }
    
    // Search by title
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }
    
    // Sort options
    let sort = {};
    if (req.query.sort === 'rating') {
      sort = { localRating: -1 };
    } else if (req.query.sort === 'newest') {
      sort = { releaseDate: -1 };
    } else if (req.query.sort === 'popular') {
      sort = { popularity: -1 };
    } else {
      sort = { title: 1 };
    }
    
    const movies = await Movie.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Movie.countDocuments(query);
    
    // Add image URLs to movies
    const moviesWithImages = movies.map(movie => addImageUrls(movie));
    
    res.json({
      movies: moviesWithImages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMovies: total
    });
  } catch (error) {
    next(error);
  }
};

// GET /movies/:id - Retrieve a specific movie with reviews
exports.getMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    let movie = await Movie.findById(movieId);
    if (!movie && /^[0-9]+$/.test(movieId)) {
      movie = await Movie.findOne({ tmdbId: parseInt(movieId, 10) });
    }
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    const reviews = await Review.find({ movieId: movie._id })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });
    return res.json({ movie: addImageUrls(movie), reviews });
  } catch (error) { next(error); }
};

// POST /movies - Add a new movie (admin only)
exports.addMovie = async (req, res, next) => {
  try {
    const {
      title,
      overview,
      releaseDate,
      genres,
      director,
      cast,
      posterPath,
      backdropPath,
      tmdbId,
      runtime,
      tagline,
      budget,
      revenue,
      homepage,
      imdbId,
      status,
      productionCompanies,
      productionCountries,
      spokenLanguages
    } = req.body;

    // Validate required fields
    if (!title || !overview) {
      return res.status(400).json({ message: 'Title and overview are required' });
    }

    // Check if movie with tmdbId already exists
    if (tmdbId) {
      const existingMovie = await Movie.findOne({ tmdbId });
      if (existingMovie) {
        return res.status(400).json({ message: 'Movie with this TMDB ID already exists' });
      }
    }

    const movie = new Movie({
      title,
      overview,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      genres: genres || [],
      director: director || '',
      cast: cast || [],
      posterPath: posterPath || '',
      backdropPath: backdropPath || '',
      tmdbId: tmdbId || null,
      runtime: runtime || 0,
      tagline: tagline || '',
      budget: budget || 0,
      revenue: revenue || 0,
      homepage: homepage || '',
      imdbId: imdbId || '',
      status: status || 'Released',
      productionCompanies: productionCompanies || [],
      productionCountries: productionCountries || [],
      spokenLanguages: spokenLanguages || [],
      averageRating: 0,
      ratingCount: 0,
      localRating: 0,
      localVoteCount: 0,
      popularity: 0
    });

    await movie.save();
    return res.status(201).json({ movie: addImageUrls(movie) });
  } catch (error) { next(error); }
};

// GET /movies/:id/reviews - Retrieve reviews for a specific movie
exports.getMovieReviews = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const reviews = await Review.find({ movieId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Review.countDocuments({ movieId });
    
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

// POST /movies/:id/reviews - Submit a new review for a movie
exports.addMovieReview = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const { rating, comment, reviewText } = req.body;
    const userId = req.user.id;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    let movie = await Movie.findById(movieId);
    if (!movie && /^[0-9]+$/.test(movieId)) movie = await Movie.findOne({ tmdbId: parseInt(movieId,10) });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    const existingReview = await Review.findOne({ movieId: movie._id, userId });
    if (existingReview) return res.status(400).json({ message: 'You have already reviewed this movie' });
    const review = await Review.create({ movieId: movie._id, userId, rating, reviewText: reviewText || comment || '' });
    const allReviews = await Review.find({ movieId: movie._id });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;
    await Movie.findByIdAndUpdate(movie._id, { localRating: avgRating, localVoteCount: allReviews.length });
    await review.populate('userId', 'username profilePicture');
    return res.status(201).json({ review });
  } catch (error) { next(error); }
};

// GET /movies/search - Search movies in local database
exports.searchMovies = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { overview: { $regex: query, $options: 'i' } },
        { genres: { $in: [new RegExp(query, 'i')] } },
        { director: { $regex: query, $options: 'i' } },
        { cast: { $in: [new RegExp(query, 'i')] } }
      ]
    };
    
    const movies = await Movie.find(searchQuery)
      .sort({ localRating: -1, popularity: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Movie.countDocuments(searchQuery);
    
    // Add image URLs to movies
    const moviesWithImages = movies.map(movie => addImageUrls(movie));
    
    res.json({
      movies: moviesWithImages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalMovies: total
    });
  } catch (error) {
    next(error);
  }
};

// GET /movies/genres - Get all available genres
exports.getGenres = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genres');
    res.json({ genres: genres.filter(g => g) }); // Filter out empty strings
  } catch (error) {
    next(error);
  }
};

// PUT /movies/:id - Update movie (admin only)
exports.updateMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData.localRating;
    delete updateData.localVoteCount;
    delete updateData.tmdbId; // Prevent changing TMDB ID
    
    const movie = await Movie.findByIdAndUpdate(
      movieId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const movieWithImages = addImageUrls(movie);
    res.json(movieWithImages);
  } catch (error) {
    next(error);
  }
};

// DELETE /movies/:id - Delete movie (admin only)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    
    const movie = await Movie.findByIdAndDelete(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Also delete all reviews for this movie
    await Review.deleteMany({ movieId });
    
    res.json({ message: 'Movie and its reviews deleted successfully' });
  } catch (error) {
    next(error);
  }
};
