import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userService } from '../services/userService';

const WatchlistButton = ({ movie, onWatchlistUpdate }) => {
  const { user } = useSelector((state) => state.auth);
  let wishlist = useSelector((state) => state.user?.wishlist);
  if (!Array.isArray(wishlist)) {
    // Handle legacy shape where entire API object was stored
    if (wishlist && Array.isArray(wishlist.watchlist)) {
      wishlist = wishlist.watchlist;
    } else {
      wishlist = [];
    }
  }
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const isInWatchlist = wishlist.some(item => (item._id || item.movieId) === movie._id);

  const toggleWatchlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isInWatchlist) {
        await userService.removeFromWatchlist(user._id || user.id, movie._id);
      } else {
        await userService.addToWatchlist(user._id || user.id, movie._id);
      }
      // Refetch wishlist after update
      const response = await userService.getWatchlist(user._id || user.id);
      dispatch({ type: 'user/setWishlist', payload: response.data });
      if (onWatchlistUpdate) {
        onWatchlistUpdate();
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button 
      onClick={toggleWatchlist}
      disabled={loading}
      className={`btn ${isInWatchlist ? 'btn-secondary' : 'btn-primary'} watchlist-btn`}
    >
  {loading ? 'Loading...' : isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
};

export default WatchlistButton;
