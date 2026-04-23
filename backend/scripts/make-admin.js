require('dotenv').config();
const { MongoClient } = require('mongodb');

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    throw new Error('Usage: npm run make:admin -- user@example.com');
  }

  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'app-house';

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const result = await db.collection('user').updateOne(
      { email },
      {
        $set: {
          role: 'admin',
          updatedAt: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      throw new Error(`No Better Auth user found for ${email}`);
    }

    console.log(`Updated ${email} to admin`);
  } finally {
    await client.close();
  }
}

makeAdmin().catch((err) => {
  console.error('Failed to update role:', err.message);
  process.exit(1);
});
