const express = require('express');
const jwt = require('jsonwebtoken');
const bc = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// =======  ======= ========    ======  =====

const router = express.Router();

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
 '/',
 [
  check('email', 'Veuillez inclure un e-mail valide').isEmail(),
  check('password', 'Veuillez saisir un mot de passe de 6 caractères ou plus')
   .isLength({ min: 6 })
   .custom((value, { req, loc, path }) => {
    if (value !== req.body.password2) {
     // Passwords do not match
     throw new Error('Les mots de passes ne se correspondent pas');
    } else {
     return value;
    }
   }),
 ],
 async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
   let user = await User.findOne({ email });

   if (user) {
    return res.status(400).json({ errors: [{ msg: 'Email déjà utilisé' }] });
   }

   user = new User({
    username,
    email,
    password,
   });

   const salt = await bc.genSalt(10);

   user.password = await bc.hash(password, salt);

   // JWT
   const payload = {
    user: {
     id: user.id,
    },
   };

   jwt.sign(
    payload,
    process.env.JWT_secret,
    { expiresIn: process.env.tokenExpiration },
    (err, token) => {
     if (err) throw err;
     return res.json({ token });
    }
   ); //TODO change to 3600

   await user.save();
  } catch (err) {
   console.error(err.message);
   return res.status(500).json('Server Error');
  }
 }
);
module.exports = router;
