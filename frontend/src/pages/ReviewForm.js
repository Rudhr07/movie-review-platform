import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { movieService } from '../services/movieService';

const ReviewForm = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovie(movieId);
        setMovie(response.data.movie);
      } catch (err) {
        setError('Failed to load movie details');
        console.error('Error fetching movie:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !reviewText.trim()) {
      setError('Please provide both rating and review text');
      return;
    }

    try {
      setSubmitting(true);
      await movieService.addReview(movieId, { rating, reviewText });
      navigate(`/movies/${movieId}`);
    } catch (err) {
      setError('Failed to submit review');
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  return (
    <div className="review-form-container">
      <div className="container">
        <div className="review-movie-header">
          <h1 className="review-movie-title">Review: {movie.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {error && <div className="error">{error}</div>}

          <div className="rating-section">
            <label>Your Rating</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  {star}
                </span>
              ))}
            </div>
            <p>Selected: {rating} / 5 stars</p>
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              rows="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-large"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;