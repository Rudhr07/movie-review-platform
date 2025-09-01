import { useNavigate } from 'react-router-dom';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const movieId = movie._id || movie.id;
  const rating = (movie.localRating || movie.averageRating || movie.voteAverage || movie.vote_average || 0);
  return (
    <div className="movie-card" onClick={() => navigate(`/movies/${movieId}`)}>
      <div style={{ position:'relative' }}>
        <img
          className="movie-poster"
          src={movie.posterUrl || (movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image')}
          alt={movie.title}
          onError={e => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
        />
        <div className="movie-rating"><span className="value">{rating ? rating.toFixed(1) : 'NA'}</span></div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>{movie.title}</h3>
        <p className="movie-year">{movie.releaseDate ? movie.releaseDate.substring(0,4) : ''}</p>
        {movie.trailerUrl && movie.trailerUrl !== '' && (
          <div style={{ marginTop: '.5rem' }}>
            <iframe
              width="100%"
              height="160"
              src={(movie.trailerUrl || '').includes('youtube') ? movie.trailerUrl.replace('watch?v=','embed/') : movie.trailerUrl}
              title="Movie Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ borderRadius: '8px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
