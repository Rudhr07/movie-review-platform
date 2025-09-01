const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  overview: {
    type: String,
    default: ''
  },
  genres: [{
    type: String
  }],
  releaseDate: {
    type: Date
  },
  director: {
    type: String,
    default: ''
  },
  cast: [{
    type: String
  }],
  posterPath: {
    type: String,
    default: ''
  },
  backdropPath: {
    type: String,
    default: ''
  },
  posterUrl: {
    type: String,
    default: ''
  },
  backdropUrl: {
    type: String,
    default: ''
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  runtime: {
    type: Number,
    default: 0
  },
  tagline: {
    type: String,
    default: ''
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  // TMDB specific fields
  voteAverage: {
    type: Number,
    default: 0
  },
  voteCount: {
    type: Number,
    default: 0
  },
  adult: {
    type: Boolean,
    default: false
  },
  originalLanguage: {
    type: String,
    default: 'en'
  },
  originalTitle: {
    type: String,
    default: ''
  },
  budget: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
  },
  homepage: {
    type: String,
    default: ''
  },
  imdbId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'Released'
  },
  productionCompanies: [{
    type: String
  }],
  productionCountries: [{
    type: String
  }],
  spokenLanguages: [{
    type: String
  }],
  // Local ratings separate from TMDB
  localRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  localVoteCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);