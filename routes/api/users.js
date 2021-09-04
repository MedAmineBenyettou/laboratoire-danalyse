const express = require('express');
const jwt = require('jsonwebtoken');
const bc = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/UserProfile');

// =======  ======= ========    ======  =====

const router = express.Router();

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
 '/',
 [
  check('email', 'Veuillez inclure un e-mail valide').isEmail(),
  check(
   'password',
   'Veuillez saisir un mot de passe de 6 caractères ou plus'
  ).isLength({ min: 6 }),
  check('adresse', "L'adresse est requise").notEmpty(),
  check('birthLocation', 'Le lieu de naissance est requis').notEmpty(),
  check('dateOfBirth', 'La date de naissance est requise').notEmpty(),
  check('nom', 'Le nom est requis').notEmpty(),
  check('phoneNumber', 'Un numéro de téléphone est requis').notEmpty(),
  check('prenom', 'Le prenom est requis').notEmpty(),
 ],
 async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   console.log(req.body);
   return res.status(400).json({ errors: errors.array() });
  }

  const {
   username,
   email,
   password,
   adresse,
   birthLocation,
   dateOfBirth,
   nom,
   phoneNumber,
   prenom,
  } = req.body;
  try {
   let user = await User.findOne({ email });

   if (user) {
    return res.status(400).json({
     errors: [{ msg: 'Email déjà utilisé par un autre utilisateur!' }],
    });
   }

   user = new User({
    username,
    email,
    password,
   });

   const salt = await bc.genSalt(10);

   user.password = await bc.hash(password, salt);

   // Create the profile:
   // Build Profile object
   const profileFields = {};
   profileFields.user = user._id;
   profileFields.prenom = prenom;
   profileFields.nom = nom;
   profileFields.dateOfBirth = Date(dateOfBirth);
   profileFields.birthLocation = birthLocation;
   profileFields.adresse = adresse;
   profileFields.phoneNumber = phoneNumber;

   try {
    let profile = await Profile.findOne({ user: user._id });
    if (profile) {
     return res
      .status(203)
      .json({ errors: [{ msg: 'Ce profil existe déjà' }] });
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    // return res.json(profile);
   } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
   ); //TODO change to 3600

   await user.save();
  } catch (err) {
   console.error(err.message);
   return res.status(500).json('Server Error');
  }
 }
);
module.exports = router;
