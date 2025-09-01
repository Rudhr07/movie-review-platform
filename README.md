# Movie Review Platform

<p align="center">
  <img src="frontend/public/logo.svg.png" alt="MovieBuzzCheck Logo" width="140" style="border-radius:24px" />
</p>

A full-stack movie review platform built with React frontend and Node.js/Express backend. Users can browse movies, read and write reviews, manage watchlists, and rate films.

> Logo concept and graphic also designed by **Rudhr Chauhan** using Canva.
Here’s the video demonstration: [https://drive.google.com/file/d/your_video_id/view?usp=sharing](https://drive.google.com/file/d/1VBV6gdupe3c9c7nEJYtFkO3K9Abd6ngi/view?usp=sharing)
## Features

### Frontend (React)
- **Home page** with featured movies and trending films
- **Movie listing page** with search and advanced filtering (genre, year, rating, etc.)
- **Individual movie pages** with details, cast, and reviews
- **User profile pages** with review history and watchlist
- **Review submission** with star ratings and text reviews
- **Movie watchlist** functionality
- **Redux state management**
- **React Router** navigation
- **Responsive design** for mobile and desktop
- **Error boundaries** for crash protection
- **Loading states** and error handling

### Backend (Node.js, Express, MongoDB)
- **RESTful API** with comprehensive endpoints
- **User authentication** (registration/login with JWT)
- **Data validation** and error handling
- **MongoDB database** with Mongoose ODM
- **Rate limiting** for API protection
- **Admin dashboard** for movie management
- **TMDB API integration** for movie data
- **Average rating calculation**
- **Pagination** and filtering support

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Movies
- `GET /api/movies` - Get all movies (with pagination and filtering)
- `GET /api/movies/:id` - Get specific movie with reviews
- `POST /api/movies` - Add new movie (admin only)
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/tmdb/search` - Search TMDB database
- `GET /api/movies/tmdb/:tmdbId` - Get TMDB movie details
- `POST /api/movies/tmdb/import` - Import movie from TMDB (admin only)

### Reviews
- `GET /api/reviews/:id` - Get reviews for a movie
- `POST /api/reviews/:id` - Submit review for a movie

### Users
- `GET /api/users/:id` - Get user profile and review history
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/watchlist` - Get user's watchlist
- `POST /api/users/:id/watchlist` - Add movie to watchlist
- `DELETE /api/users/:id/watchlist/:movieId` - Remove movie from watchlist
- `GET /api/users/:id/reviews` - Get user's review history

## Database Schema

### Movies
```javascript
{
  tmdbId: Number,           // TMDB ID (optional)
  title: String,            // Movie title
  overview: String,         // Movie synopsis
  genres: [String],         // Array of genres
  releaseDate: Date,        // Release date
  director: String,         // Director name
  cast: [String],          // Array of cast members
  posterUrl: String,        // Poster image URL
  backdropUrl: String,      // Backdrop image URL
  trailerUrl: String,       // Trailer URL
  runtime: Number,          // Runtime in minutes
  tagline: String,          // Movie tagline
  averageRating: Number,    // Calculated average rating
  ratingCount: Number,      // Number of ratings
  popularity: Number        // Popularity score
}
```

### Users
```javascript
{
  username: String,         // Unique username
  email: String,           // User email
  password: String,        // Hashed password
  profilePicture: String,  // Profile picture URL
  joinDate: Date,          // Account creation date
  isAdmin: Boolean         // Admin privileges
}
```

### Reviews
```javascript
{
  userId: ObjectId,        // Reference to User
  movieId: ObjectId,       // Reference to Movie
  rating: Number,          // Rating (1-5 stars)
  reviewText: String,      // Review content
  likes: [ObjectId],       // Array of user IDs who liked
  isEdited: Boolean        // If review was edited
}
```

### Watchlist
```javascript
{
  userId: ObjectId,        // Reference to User
  movieId: ObjectId,       // Reference to Movie
  dateAdded: Date          // When added to watchlist
}
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- TMDB API key (optional, for movie data)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Configuration:**
```bash
cp .env.example .env
```

4. **Edit `.env` file with your configuration:**
```env
DB_URI=mongodb://localhost:27017/moviereview
JWT_SECRET=your_very_long_and_secure_jwt_secret_here
TMDB_API_KEY=your_tmdb_api_key_here
PORT=5000
NODE_ENV=development
```

5. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm start
```

The frontend will be available at `http://localhost:3000`
The backend will be available at `http://localhost:5000`

### Database Setup

**Local MongoDB:**
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

**MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster and get connection string
3. Update `DB_URI` in `.env` file

### TMDB API Setup (Optional)

1. Create account at [TMDB](https://www.themoviedb.org/settings/api)
2. Generate API key
3. Add to `.env` file as `TMDB_API_KEY`

## Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production
```bash
# Frontend build
cd frontend && npm run build

# Backend is production-ready as-is
```

## Rate Limiting

The API includes rate limiting to prevent abuse:
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Reviews**: 10 submissions per hour
- **External API calls**: 30 requests per minute

## Security Features

- **JWT Authentication** with secure tokens
- **Password hashing** with bcrypt
- **Input validation** on all endpoints
- **Rate limiting** to prevent abuse
- **Error handling** without sensitive data exposure
- **CORS configuration** for cross-origin requests

## Performance Optimizations

- **Pagination** for large datasets
- **Database indexing** for fast queries
- **Image optimization** with TMDB integration
- **Caching strategies** for frequently accessed data
- **Lazy loading** for better user experience

## Project Structure

```
movie-review-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── server.js       # Server entry point
│   └── package.json
├── frontend/
│   ├── public/         # Public assets
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── store/      # Redux store
│   │   ├── styles/     # CSS files
│   │   └── App.js      # Main app component
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request


## Support

For support, email [rudhr.chauhan@gmail.com] or create an issue on GitHub.

## Author

**Rudhr Chauhan**  
Creator & maintainer of MovieBuzzCheck (including custom logo design)
🎓 BCA Student | Aspiring Developer
💼 Interested in Full Stack, Cybersecurity, and Cloud
