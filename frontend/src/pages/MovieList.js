import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import MovieCard from '../components/MovieCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import { movieService } from '../services/movieService';
import './MovieList.css';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 50,
          search: searchQuery || searchTerm,
          ...filters
        };

        const response = await movieService.getMovies(params);
        setMovies(response.data.movies);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to load movies');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, searchTerm, currentPage, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <Layout>
      <div className="movie-list-page">
        {/* Simplified top search bar */}
        <div className="movies-top-bar">
          <SearchBar onSearch={handleSearch} placeholder="Search..." />
        </div>

        {/* Main Content */}
        <div className="movie-list-content">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <FilterPanel onFiltersChange={handleFiltersChange} currentFilters={filters} />
          </aside>

          {/* Movies Grid */}
          <main className="movies-main">
            {loading ? (
              <div className="loading">
                <span>Loading amazing movies...</span>
              </div>
            ) : error ? (
              <div className="error">
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button 
                  className="btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Movies Count */}
                <div className="movies-header">
                  <h2 className="section-title">
                    {movies.length > 0 ? `${movies.length} results` : 'No results'}
                  </h2>
                  {(searchQuery || searchTerm || Object.keys(filters).some(key => filters[key])) && (
                    <button 
                      className="clear-all-btn"
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({});
                        setSearchParams({});
                      }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Movies Grid */}
                {movies.length > 0 ? (
                  <div className="movies-grid">
                    {movies.map((movie) => (
                      <MovieCard key={movie._id || movie.id} movie={movie} />
                    ))}
                  </div>
                ) : (
                  <div className="no-movies">
                    <div className="no-movies-icon" aria-hidden="true"></div>
                    <h3>No movies found</h3>
                    <p>Try adjusting your search criteria or browse our featured movies</p>
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({});
                        setSearchParams({});
                      }}
                    >
                      Browse All Movies
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="pagination-btn"
                    >
                      ← Previous
                    </button>
                    
                    <div className="pagination-info">
                      <span>Page {currentPage} of {totalPages}</span>
                    </div>
                    
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="pagination-btn"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default MovieList;