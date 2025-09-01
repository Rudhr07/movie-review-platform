const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const { fetchPopularMovies, fetchMoviesByGenre, fetchMovieDetails } = require('./utils/tmdbAPI');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const genreIds = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

async function seedMovies() {
  try {
    console.log('Starting movie seeding process...');
    
    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    const allMovies = new Set();
    
    // Fetch even more popular movies
    console.log('Fetching popular movies...');
    for (let page = 1; page <= 20; page++) {
      const popularMovies = await fetchPopularMovies(page);
      popularMovies.forEach(movie => allMovies.add(JSON.stringify(movie)));
      console.log(`Fetched page ${page} of popular movies`);
    }

    // Fetch more movies by genre
    console.log('Fetching movies by genre...');
    for (const genre of genreIds) {
      for (let page = 1; page <= 5; page++) {
        try {
          const genreMovies = await fetchMoviesByGenre(genre.id, page);
          genreMovies.forEach(movie => allMovies.add(JSON.stringify(movie)));
          console.log(`Fetched ${genre.name} movies (page ${page})`);
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 250));
        } catch (error) {
          console.log(`Error fetching ${genre.name} movies (page ${page}):`, error.message);
        }
      }
    }

    console.log(`Total unique movies found: ${allMovies.size}`);

    // Convert back to objects and process
    const movieArray = Array.from(allMovies).map(movieStr => JSON.parse(movieStr));
    
    // Process and save movies with detailed information
    const savedMovies = [];
    let processed = 0;
    
    for (const movie of movieArray) {
      try {
        // Get detailed movie information
        const detailedMovie = await fetchMovieDetails(movie.id);

        // Fetch trailer URL from TMDB videos API
        let trailerUrl = '';
        try {
          const axios = require('axios');
          const API_KEY = process.env.TMDB_API_KEY;
          const videosRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`);
          const videos = videosRes.data.results || [];
          const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
          if (trailer) {
            trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
          }
        } catch (err) {
          console.log(`No trailer found for movie ${movie.title}`);
        }

        const movieData = {
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          releaseDate: movie.release_date,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          voteAverage: movie.vote_average || 0,
          voteCount: movie.vote_count || 0,
          popularity: movie.popularity || 0,
          adult: movie.adult || false,
          originalLanguage: movie.original_language,
          originalTitle: movie.original_title,

          // Enhanced data from detailed fetch
          runtime: detailedMovie.runtime,
          budget: detailedMovie.budget,
          revenue: detailedMovie.revenue,
          homepage: detailedMovie.homepage,
          imdbId: detailedMovie.imdb_id,
          status: detailedMovie.status,
          tagline: detailedMovie.tagline,

          // Genres
          genres: detailedMovie.genres ? detailedMovie.genres.map(g => g.name) : [],

          // Production companies
          productionCompanies: detailedMovie.production_companies ? 
            detailedMovie.production_companies.map(pc => pc.name) : [],

          // Production countries
          productionCountries: detailedMovie.production_countries ? 
            detailedMovie.production_countries.map(pc => pc.name) : [],

          // Spoken languages
          spokenLanguages: detailedMovie.spoken_languages ? 
            detailedMovie.spoken_languages.map(sl => sl.english_name) : [],

          // Trailer URL
          trailerUrl,

          // Local data
          localRating: 0,
          localVoteCount: 0,
          reviews: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const savedMovie = await Movie.create(movieData);
        savedMovies.push(savedMovie);
        processed++;

        if (processed % 10 === 0) {
          console.log(`Processed ${processed}/${movieArray.length} movies`);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`Error processing movie ${movie.title}:`, error.message);
      }
    }

    console.log(`Successfully seeded ${savedMovies.length} movies to the database`);
    console.log('Movie seeding completed!');
    
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seeding
seedMovies();
