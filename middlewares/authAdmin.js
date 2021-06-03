const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
 // Get Token from Header
 const token = req.header('x-auth-admin-token');

 // Check if no Token
 if (!token) {
  return res.status(401).json({ msg: 'No Token, authorization denied' });
 }

 // Verify
 try {
  const decoded = jwt.verify(token, process.env.JWTsecret);

  req.admin = decoded.admin;
  next();
 } catch (err) {
  return res.status('401').json({ msg: 'Token is not valide' });
 }
};
