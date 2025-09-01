import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userService } from '../services/userService';
import MovieCard from '../components/MovieCard';
import ReviewCard from '../components/ReviewCard';

const UserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await userService.getUserProfile(id);
        setUserData(userResponse.data);
        
        // Fetch user reviews
        const reviewsResponse = await userService.getUserReviews(id);
        setReviews(reviewsResponse.data);
        
        // Fetch user watchlist
        const watchlistResponse = await userService.getWatchlist(id);
        setWatchlist(watchlistResponse.data);
        
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!userData) {
    return <div className="error">User not found</div>;
  }

  const isOwnProfile = currentUser && currentUser._id === id;

  return (
    <div className="user-profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {userData.username.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-username">{userData.username}</h1>
          <p className="profile-email">{userData.email}</p>
          <p className="profile-joined">
            Joined {new Date(userData.joinDate).toLocaleDateString()}
          </p>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Recent Reviews</h3>
            {reviews.length === 0 ? (
              <div className="empty-state">
                <p>No reviews yet</p>
                {isOwnProfile && (
                  <p>Start reviewing movies to see them here!</p>
                )}
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))
            )}
          </div>

          <div className="profile-section">
            <h3>Watchlist ({watchlist.length})</h3>
            {watchlist.length === 0 ? (
              <div className="empty-state">
                <p>Watchlist is empty</p>
                {isOwnProfile && (
                  <p>Add movies to your watchlist to see them here!</p>
                )}
              </div>
            ) : (
              <div className="watchlist-grid">
                {watchlist.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;