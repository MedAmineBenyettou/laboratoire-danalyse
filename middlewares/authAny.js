const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
 // Get Token from Header
 const token1 = req.header('x-auth-token');
 const token2 = req.header('x-admin-auth-token');

 // Check if no Token
 if (!token1 && !token2) {
  return res.status(401).json({ msg: 'No Token, authorization denied' });
 } else {
  // Verify
  try {
   const token = token1 || token2;
   const decoded = jwt.verify(token, process.env.JWT_secret);
   req.user = decoded.user ? decoded.user : decoded.admin;

   next();
  } catch (err) {
   return res.status('401').json({ msg: 'Token is not valide' });
  }
 }
};
