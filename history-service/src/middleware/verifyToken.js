// Middleware de vérification du JWT
const jwt = require('jsonwebtoken');

const extractToken = (authHeader) => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && /^bearer$/i.test(parts[0])) {
    return parts[1];
  }

  return authHeader.trim();
};

const verifyToken = (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.token = token;
    req.authHeader = `Bearer ${token}`;
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expiré' });
    }

    if (error.name === 'JsonWebTokenError') {
      if (error.message === 'invalid signature') {
        return res.status(403).json({ error: 'Signature du token invalide' });
      }

      if (error.message === 'jwt malformed') {
        return res.status(403).json({ error: 'Token JWT mal formé' });
      }

      if (error.message === 'secret or public key must be provided') {
        return res.status(500).json({ error: 'JWT_SECRET non configuré' });
      }
    }

    res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = verifyToken;