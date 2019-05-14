const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req) return next();
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    req.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  return next();
};
