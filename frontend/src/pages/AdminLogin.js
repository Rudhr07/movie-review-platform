import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess && user && user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (isSuccess && user && user.role !== 'admin') {
      alert('Access denied. Admin credentials required.');
      dispatch(reset());
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
        <h2 className="form-title">Admin Login</h2>
        <p className="text-center mb-4" style={{color: 'var(--gray-600)'}}>
          Restricted access for administrators only
        </p>
        
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
              placeholder="Enter admin email"
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
              placeholder="Enter admin password"
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
              'Sign In as Admin'
            )}
          </button>
        </form>

        <div className="form-footer">
          <a href="/login">← Back to User Login</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
