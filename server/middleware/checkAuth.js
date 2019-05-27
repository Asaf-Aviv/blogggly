module.exports = (req, res, next) => (req.userId ? next() : res.status(401).send());
