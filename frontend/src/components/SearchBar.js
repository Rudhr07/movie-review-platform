import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search movies..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          {/* Removed search icon for a cleaner look */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-button"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button type="submit" className="search-button">
            <span className="search-btn-text">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;