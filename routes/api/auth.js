const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const bc = require('bcryptjs');

// @route   GET api/auth
// @desc    Get current user
// @access  Private
router.get('/', auth, async (req, res) => {
 try {
  const user = await User.findById(req.user.id).select('-password');
  return res.json(user);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send('Server Error');
 }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
 '/',
 [
  check('email', 'Veuillez inclure un e-mail valide').isEmail(),
  check('password', 'Mot de passe requis').exists(),
 ],
 async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
   let user = await User.findOne({ email });

   if (!user) {
    return res.status(400).json({
     errors: [{ msg: "Les informations d'identification sont invalides" }],
    });
   }

   const isMatch = await bc.compare(password, user.password);

   if (!isMatch) {
    return res.status(400).json({
     errors: [{ msg: "Les informations d'identification sont invalides" }],
    });
   }
   // JWT
   const payload = {
    user: {
     id: user.id,
    },
   };

   jwt.sign(
    payload,
    process.env.JWT_secret,
    { expiresIn: process.env.Token_Expiration },
    (err, token) => {
     if (err) throw err;
     return res.json({ token });
    }
   );

   await user.save();
  } catch (err) {
   console.error(err.message);
   return res.status(500).json('Server Error');
  }
 }
);

module.exports = router;
