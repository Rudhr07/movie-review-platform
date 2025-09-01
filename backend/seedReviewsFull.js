// Seed at least 10 reviews per movie
require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Review = require('./models/Review');
const User = require('./models/User');

const SAMPLE_REVIEWS = [
  'Engaging from start to finish.',
  'Script could be tighter but performances shine.',
  'Exceeded expectations – emotionally rich.',
  'Technically impressive, narratively average.',
  'Pacing drags in the middle act.',
  'A masterclass in visual storytelling.',
  'Dialogue felt natural and grounded.',
  'Score elevates key scenes beautifully.',
  'Predictable yet still satisfying.',
  'Ambitious and largely successful.',
  'Some characters lacked depth.',
  'Memorable climax and resolution.'
];

async function ensureTestUsers(count = 12) {
  const existing = await User.find({ email: /seed-user-[0-9]+@example.com/ });
  const users = [...existing];
  const needed = count - existing.length;
  for (let i = 0; i < needed; i++) {
    const idx = existing.length + i + 1;
    const u = await User.create({
      username: `seeduser${idx}`,
      email: `seed-user-${idx}@example.com`,
      password: 'SeedPass123!'
    });
    users.push(u);
  }
  return users.slice(0, count);
}

(async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review-platform';
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const movies = await Movie.find({});
    console.log(`Found ${movies.length} movies`);
    const users = await ensureTestUsers(15);

    let totalCreated = 0;

    for (const movie of movies) {
      const existingCount = await Review.countDocuments({ movieId: movie._id });
      if (existingCount >= 10) continue;
      const needed = 10 - existingCount;
      // Shuffle users for variety
      const shuffled = [...users].sort(() => Math.random() - 0.5);
      let createdForMovie = 0;
      for (const user of shuffled) {
        if (createdForMovie >= needed) break;
        const already = await Review.findOne({ movieId: movie._id, userId: user._id });
        if (already) continue;
        const rating = Math.floor(Math.random() * 5) + 1;
        const text = SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)];
        await Review.create({ movieId: movie._id, userId: user._id, rating, reviewText: text });
        createdForMovie++;
        totalCreated++;
      }
      // Recompute after seeding this movie
      const reviewsNow = await Review.find({ movieId: movie._id });
      const avg = reviewsNow.reduce((s, r) => s + r.rating, 0) / reviewsNow.length;
      movie.localRating = avg;
      movie.localVoteCount = reviewsNow.length;
      await movie.save();
      if (createdForMovie) {
        console.log(`Movie ${movie.title} -> added ${createdForMovie} reviews (total ${reviewsNow.length})`);
      }
    }

    console.log(`Completed. Added ${totalCreated} reviews to reach at least 10 per movie.`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
