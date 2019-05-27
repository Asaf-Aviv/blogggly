const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req) return next();
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.userId = null;
    return next();
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    req.userId = null;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    req.userId = null;
    return next();
  }

  if (!decodedToken) {
    req.userId = null;
    return next();
  }

  req.userId = decodedToken.userId;
  return next();
};
