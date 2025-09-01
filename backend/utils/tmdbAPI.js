
require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
});

// Add error handling for missing API key
if (!API_KEY) {
  console.warn('TMDB_API_KEY is missing from environment variables');
}

exports.searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbAPI.get('/search/movie', {
      params: { query, page }
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    throw new Error('Failed to search movies');
  }
};

exports.fetchMovieDetails = async (movieId) => {
  try {
    const response = await tmdbAPI.get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits' }
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    throw new Error('Failed to fetch movie details');
  }
};

exports.fetchPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbAPI.get('/movie/popular', {
      params: { page }
    });
    return response.data.results;
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    throw new Error('Failed to fetch popular movies');
  }
};

exports.fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbAPI.get('/discover/movie', {
      params: { 
        page,
        with_genres: genreId,
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    throw new Error('Failed to fetch movies by genre');
  }
};

exports.getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};