// Seed random reviews for all movies
require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Review = require('./models/Review');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review-platform');
    const movies = await Movie.find({}).limit(150);

    // Ensure at least one normal user exists
    let user = await User.findOne({ email: 'demo@user.local' });
    if (!user) {
      user = await User.create({ username: 'demoUser', email: 'demo@user.local', password: 'Password123!' });
    }

    const sampleTexts = [
      'Great pacing and solid performances.',
      'Average story but visually impressive.',
      'Did not meet expectations, weak script.',
      'Outstanding film – will rewatch!',
      'Soundtrack carried many moments.',
      'Characters felt underdeveloped.',
      'A surprising emotional depth.',
      'Fun but forgettable.'
    ];

    let created = 0;
    for (const m of movies) {
      const existing = await Review.findOne({ movieId: m._id, userId: user._id });
      if (existing) continue;
      const rating = Math.ceil(Math.random() * 5);
      const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      await Review.create({ movieId: m._id, userId: user._id, rating, reviewText: text });
      created++;
    }

    // Recompute local ratings
    for (const m of movies) {
      const reviews = await Review.find({ movieId: m._id });
      if (!reviews.length) continue;
      const total = reviews.reduce((s,r)=>s+r.rating,0);
      const avg = total / reviews.length;
      m.localRating = avg;
      m.localVoteCount = reviews.length;
      await m.save();
    }

    console.log(`Seeded ${created} reviews.`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
