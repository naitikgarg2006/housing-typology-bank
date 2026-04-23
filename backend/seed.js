require('dotenv').config();
const readline = require('readline');
const { connectDB } = require('./db');
const User = require('./models/User');
const Typology = require('./models/Typology');
const Feedback = require('./models/Feedback');

function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function clearDatabase() {
  const answer = await confirm(
    'This will permanently delete ALL users, typologies, and feedback. Continue? (y/N): '
  );

  if (answer !== 'y' && answer !== 'yes') {
    console.log('Aborted.');
    process.exit(0);
  }

  console.log('Clearing MongoDB data...');
  await connectDB();

  const [usersResult, typologiesResult, feedbackResult] = await Promise.all([
    User.deleteMany({}),
    Typology.deleteMany({}),
    Feedback.deleteMany({}),
  ]);

  console.log(`Deleted ${usersResult.deletedCount} users`);
  console.log(`Deleted ${typologiesResult.deletedCount} typologies`);
  console.log(`Deleted ${feedbackResult.deletedCount} feedback entries`);
}

clearDatabase()
  .then(() => {
    console.log('MongoDB database is now empty');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database clear failed', err);
    process.exit(1);
  });
