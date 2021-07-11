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
  if (!admin)
   res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
  return res.json(admin);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send('Erreur du serveur');
 }
});

// @route   PUT api/admin/auth
// @desc    Update current admin
// @access  Private
router.put('/', authAdmin, async (req, res) => {
 try {
  var admin = await Admin.findById(req.admin.id).select('-password');
  if (!admin)
   res.status(404).json({ errors: [{ msg: 'Utilisateur non trouvé' }] });
  const { username, password } = req.body;
  // Build Profile object
  const authFields = {};
  if (username) {
   admin = await Admin.findOne({ username });
   if (admin)
    return res.status(400).json({
     errors: [
      { msg: "Un utilisateur avec le meme 'Nom d'utilisateur' existe deja" },
     ],
    });
   authFields.username = username;
  }
  if (password) {
   if (password.length >= 6) authFields.password = password;
   else
    res.status(400).json({
     errors: [{ msg: 'Mot de passe doit contenir 6 caractères ou plus' }],
    });
  }
  admin = await Admin.findByIdAndUpdate(
   req.admin.id,
   { $set: authFields },
   { new: true }
  ).select('-password');
  console.log(authFields, admin);
  return res.json(admin);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send('Erreur du serveur');
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
  const errors = validationResult(req);
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
