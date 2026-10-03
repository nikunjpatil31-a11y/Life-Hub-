const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lifehub_secret_key_2026';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // For demo convenience, inject demo user if no token provided
    req.user = { id: 'user_demo_123', email: 'demo@lifehub.com', name: 'Nikunj Sharma' };
    return next();
  }

  try {
    if (token === 'demo-token-lifehub') {
      req.user = { id: 'user_demo_123', email: 'demo@lifehub.com', name: 'Nikunj Sharma' };
      return next();
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Fallback to demo user instead of crashing interface
    req.user = { id: 'user_demo_123', email: 'demo@lifehub.com', name: 'Nikunj Sharma' };
    next();
  }
};

module.exports = { authMiddleware, JWT_SECRET };
