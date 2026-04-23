const { getSessionFromRequest } = require('../betterAuth');

async function authenticateToken(req, res, next) {
  try {
    const session = await getSessionFromRequest(req);

    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role || 'user',
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
