require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');
const { getBetterAuthHandler } = require('./betterAuth');

const typologyRoutes = require('./routes/typologies');
const feedbackRoutes = require('./routes/feedback');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5001;

async function start() {
  await connectDB();

  const authHandler = await getBetterAuthHandler();

  app.use(
    cors({
      origin: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      credentials: true,
    })
  );

  app.all('/api/auth/*', authHandler);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.use('/api/typologies', typologyRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
