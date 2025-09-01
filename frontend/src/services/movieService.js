import api from './api';

export const movieService = {
  getMovies: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return api.get(`/movies?${queryParams}`);
  },
  getMovie: (id) => api.get(`/movies/${id}`),
  searchMovies: (query, page = 1) => api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),
  addReview: (movieId, reviewData) => api.post(`/movies/${movieId}/reviews`, reviewData),
  getGenres: () => api.get('/movies/genres'),
  addMovie: (movieData) => api.post('/movies', movieData)
};