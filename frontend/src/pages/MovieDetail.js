import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { movieService } from '../services/movieService';
import WatchlistButton from '../components/WatchlistButton';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Review form state
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Refetch reviews after submission
  const fetchReviews = async () => {
    try {
      const response = await movieService.getMovie(id);
      setReviews(response.data.reviews || []);
      setMovie(response.data.movie || response.data);
    } catch (err) {
      setError('Failed to reload reviews');
    }
  };

  // Review submit handler
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setReviewSubmitting(true);
    setReviewError('');
    try {
      await movieService.addReview(movie._id || movie.tmdbId || id, {
        rating: Number(reviewRating),
        reviewText
      });
      setReviewText('');
      setReviewRating('');
      await fetchReviews();
    } catch (err) {
      setReviewError(err?.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovie(id);
        setMovie(response.data.movie || response.data);
        setReviews(response.data.reviews || []);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
    // Sync wishlist for accurate heart icon
    if (user && user._id) {
      import('../store/slices/userThunks').then(({ fetchWishlist }) => {
        dispatch(fetchWishlist(user._id));
      });
    }
  }, [id, dispatch, user]);

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!movie) {
    return <div className="error">Movie not found</div>;
  }

  // Determine if current user has already submitted a review
  const hasUserReview = !!(user && reviews.some(r => (r.userId?._id || r.userId) === user._id));

  return (
    <div className="movie-detail">
      <div className="container">
        <div className="movie-hero">
          <img
            src={movie.backdropUrl || 'https://via.placeholder.com/1200x400/333/fff?text=No+Backdrop'}
            alt={movie.title}
            className="movie-backdrop"
          />
          <div className="movie-hero-content">
            <h1 className="movie-title-large">{movie.title}</h1>
            <div className="movie-meta">
              <span className="movie-rating"><span className="value">{(movie.averageRating || movie.localRating || 0).toFixed(1)}</span></span>
              <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}</span>
              <span>{(movie.genres || []).join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Trailer Section */}
        {movie.trailerUrl && (
          <div className="trailer-section">
            <h3>Trailer</h3>
            <iframe
              className="trailer-frame"
              src={movie.trailerUrl}
              title="Movie Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        )}

        <div className="movie-info-section">
          <div className="movie-details-grid">
            <img
              src={movie.posterUrl || 'https://via.placeholder.com/300x450/333/fff?text=No+Image'}
              alt={movie.title}
              className="movie-poster-large"
            />
            <div>
              <h2>Overview</h2>
              <p className="movie-overview">{movie.overview || 'No overview available.'}</p>
              
              <div className="movie-meta">
                <p><strong>Director:</strong> {movie.director || 'Unknown'}</p>
                <p><strong>Cast:</strong> {(movie.cast || []).join(', ') || 'Unknown'}</p>
                <p><strong>Rating:</strong> {(movie.averageRating || movie.localRating || 0).toFixed(1)} ({movie.ratingCount || movie.localVoteCount || 0} reviews)</p>
              </div>

              {user && (
                <div className="action-buttons">
                  {!hasUserReview && (
                    <button
                      className="btn btn-primary add-review-btn"
                      onClick={() => setShowReviewForm((prev) => !prev)}
                    >
                      {showReviewForm ? 'Cancel Review' : 'Add Review'}
                    </button>
                  )}
                  {hasUserReview && (
                    <div className="inline-warning" role="status" aria-live="polite">
                      You have already reviewed this movie
                    </div>
                  )}
                  <WatchlistButton movie={movie} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews ({reviews.length})</h2>
          
          {reviews.length === 0 ? (
            <>
              {/* Preloaded random reviews if none exist */}
              <div className="review-card">
                <div className="review-header">
                  <span className="review-user">MovieFan123</span>
                  <span className="review-rating">5</span>
                  <span className="review-date">2025-08-01</span>
                </div>
                <p className="review-text">Absolutely loved this movie! Highly recommended.</p>
              </div>
              <div className="review-card">
                <div className="review-header">
                  <span className="review-user">CinemaBuff</span>
                  <span className="review-rating">4</span>
                  <span className="review-date">2025-08-02</span>
                </div>
                <p className="review-text">Great performances and story. Will watch again!</p>
              </div>
            </>
          ) : (
            reviews.map((review) => (
                <div key={review._id} className="review-card">
                <div className="review-header">
                  <span className="review-user">{review.userId?.username || 'Anonymous'}</span>
                  <span className="review-rating">{review.rating}</span>
                  <span className="review-date">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '2025-08-01'}
                  </span>
                </div>
                <p className="review-text">{review.reviewText || review.comment}</p>
              </div>
            ))
          )}
          {/* Review Submission Form - login prompt for unauthenticated users */}
          <div className="review-form-section">
            {showReviewForm && !hasUserReview && (
              user ? (
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <label>
                    Rating:
                    <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} required>
                      <option value="">Select</option>
                      {[1,2,3,4,5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Review:
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      required
                      rows={3}
                    />
                  </label>
                  <button type="submit" className="btn btn-primary" disabled={reviewSubmitting}>
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  {reviewError && <div className="error">{reviewError}</div>}
                </form>
              ) : (
                <div className="login-prompt"><p>You must <Link to="/login">login</Link> or <Link to="/register">register</Link> to submit a review.</p></div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
