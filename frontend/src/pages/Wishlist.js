import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const wishlist = useSelector((state) => state.user?.wishlist || []);
  return (
    <div className="wishlist-page container">
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No movies in your wishlist yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {wishlist.map((movie) => (
            <li key={movie._id || movie.id} style={{ marginBottom: '1rem' }}>
              <Link to={`/movies/${movie._id || movie.id}`} style={{ color: '#007bff', textDecoration: 'underline' }}>
                {movie.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;