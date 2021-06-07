const express = require('express');
const bc = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const Admin = require('../../../models/Admin');
const authAdmin = require('../../../middlewares/authAdmin');

// =======  ======= ========    ======  =====

const router = express.Router();

// @route   POST api/admin
// @desc    Register Admin
// @access  Private
router.post(
 '/',
 authAdmin,
 [
  check('username', "Veuillez inclure un nom d'utilisateur").notEmpty(),
  check(
   'password',
   'Veuillez saisir un mot de passe de 6 caractères ou plus'
  ).isLength({ min: 6 }),
 ],
 async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
   let admin = await Admin.findOne({ username });

   if (user) {
    return res
     .status(400)
     .json({ errors: [{ msg: "Nom d'utilisateur déjà utilisé" }] });
   }

   admin = new Admin({
    username,
    password,
   });

   const salt = await bc.genSalt(10);

   admin.password = await bc.hash(password, salt);

   await admin.save();

   var final = admin.toObject();
   delete final.password;
   return res.json(final);
  } catch (err) {
   console.error(err.message);
   return res.status(500).json('Server Error');
  }
 }
);
module.exports = router;
