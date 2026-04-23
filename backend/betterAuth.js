let betterAuthStatePromise = null;

async function getBetterAuthState() {
  if (betterAuthStatePromise) return betterAuthStatePromise;

  betterAuthStatePromise = (async () => {
    const [{ betterAuth }, { mongodbAdapter }, { MongoClient }, { toNodeHandler }] =
      await Promise.all([
        import('better-auth'),
        import('better-auth/adapters/mongodb'),
        import('mongodb'),
        import('better-auth/node'),
      ]);

    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME || 'app-house';

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not configured');
    }

    if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length < 32) {
      throw new Error('BETTER_AUTH_SECRET must be set and at least 32 characters long');
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(dbName);

    const auth = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      database: mongodbAdapter(db, { client }),
      emailAndPassword: {
        enabled: true,
      },
      user: {
        additionalFields: {
          role: {
            type: 'string',
            required: false,
            defaultValue: 'user',
            input: false,
          },
        },
      },
    });

    return {
      auth,
      client,
      handler: toNodeHandler(auth),
    };
  })();

  return betterAuthStatePromise;
}

async function getBetterAuthHandler() {
  const state = await getBetterAuthState();
  return state.handler;
}

async function getSessionFromRequest(req) {
  const state = await getBetterAuthState();
  return state.auth.api.getSession({
    headers: req.headers,
  });
}

module.exports = {
  getBetterAuthHandler,
  getBetterAuthState,
  getSessionFromRequest,
};
