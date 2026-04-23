const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  connectionPromise = null;
  console.log('MongoDB disconnected');
});

async function closeDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

process.once('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.once('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

async function connectDB() {
  if (isConnected) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (mongoUri.includes('<db_password>')) {
    throw new Error('Replace <db_password> in MONGODB_URI with your real MongoDB password');
  }

  connectionPromise = mongoose
    .connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'app-house',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      isConnected = true;
      return mongoose.connection;
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
}

module.exports = { connectDB, closeDB };
