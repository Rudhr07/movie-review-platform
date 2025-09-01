import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

// Deprecated: Replaced by Header component with avatar + wishlist dropdown
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          MovieReview
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/movies" className="nav-link">
              Movies
            </Link>
          </li>
        </ul>
        
        <div className="nav-actions">
          {user ? (
            <>
              <span style={{ color: 'var(--gray-600)', marginRight: '1rem' }}>
                Welcome, {user.username}
              </span>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="btn btn-sm btn-secondary">
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-sm btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
