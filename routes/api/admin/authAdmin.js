const express = require('express');
const router = express.Router();
const authAdmin = require('../../../middlewares/authAdmin');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Admin = require('../../../models/Admin');
const bc = require('bcryptjs');

// @route   GET api/admin/auth
// @desc    Get current admin
// @access  Private
router.get('/', authAdmin, async (req, res) => {
 try {
  const admin = await Admin.findById(req.admin.id).select('-password');
  return res.json(admin);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send('Server Error');
 }
});

// @route   POST api/admin/auth
// @desc    Authenticate admin & get token
// @access  Public
router.post(
 '/',
 [
  check('username', 'Veuillez inclure un e-mail valide').notEmpty(),
  check('password', 'Mot de passe requis').exists(),
 ],
 async (req, res) => {
  const errors = validationResult(req).array();
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
   let admin = await Admin.findOne({ username });

   if (!admin) {
    return res.status(400).json({
     errors: [{ msg: "Les informations d'identification sont invalides" }],
    });
   }

   const isMatch = await bc.compare(password, admin.password);

   if (!isMatch) {
    return res.status(400).json({
     errors: [{ msg: "Les informations d'identification sont invalides" }],
    });
   }
   // JWT
   const payload = {
    admin: {
     id: admin.id,
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

   await admin.save();
  } catch (err) {
   console.error(err.message);
   return res.status(500).json('Server Error');
  }
 }
);

module.exports = router;
