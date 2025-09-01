import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { movieService } from '../services/movieService';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const res = await movieService.getMovies({ sort: 'popular', limit: 20 });
        setMovies(res.data.movies || []);
        setError('');
      } catch (err) {
        setError('Could not load movies');
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Discover Movies</h1>
        <p className="page-subtitle">Popular picks right now</p>
      </div>
      {loading && <div className="loading"><span className="spinner-sm"></span> Loading movies...</div>}
      {error && !loading && <div className="error-message">{error}</div>}
      {!loading && !error && (
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie._id || movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
