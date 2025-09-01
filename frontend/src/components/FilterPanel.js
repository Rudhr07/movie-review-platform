import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ onFiltersChange, currentFilters = {} }) => {
  const [filters, setFilters] = useState({
    genre: currentFilters.genre || '',
    year: currentFilters.year || '',
    minRating: currentFilters.minRating || '',
    sort: currentFilters.sort || 'popular',
    ...currentFilters
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
    'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      genre: '',
      year: '',
      minRating: '',
      sort: 'popular'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.genre || filters.year || filters.minRating || filters.sort !== 'popular';

  return (
    <div className={`filter-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="filter-header">
        <div className="filter-title">
          <h3>
            Filters
            {hasActiveFilters && <span className="active-indicator"></span>}
          </h3>
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
        >
          <span className={`chevron ${isCollapsed ? 'down' : 'up'}`}>▼</span>
        </button>
      </div>

      <div className="filter-content">
        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="genre" className="filter-label">
              Genre
            </label>
            <div className="select-wrapper">
              <select
                id="genre"
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="filter-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="year" className="filter-label">
              Release Year
            </label>
            <div className="select-wrapper">
              <select
                id="year"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="filter-select"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

        </div>

        {hasActiveFilters && (
          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;