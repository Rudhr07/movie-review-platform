import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import { fetchWishlist } from '../store/slices/userThunks';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) {
      if (user && user._id) {
        dispatch(fetchWishlist(user._id));
      }
      navigate('/');
    }
    
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, user, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'.9rem',marginBottom:'.75rem'}}>
          <img src="/logo.svg.png" alt="MovieBuzzCheck" height={82} width={82} style={{filter:'drop-shadow(0 3px 6px rgba(0,0,0,.18))',borderRadius:'16px'}} />
          <h2 className="form-title" style={{margin:0}}>Welcome Back</h2>
        </div>
        
        {isError && (
          <div className="alert alert-error">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="btn btn-primary form-submit"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="form-footer">
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
        
        <div className="form-footer mt-4">
          <Link to="/admin/login">Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;