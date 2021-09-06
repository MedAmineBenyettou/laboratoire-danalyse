const express = require('express');
const Profile = require('../../models/UserProfile');
const auth = require('../../middlewares/auth');
const authAny = require('../../middlewares/authAny');
const authAdmin = require('../../middlewares/authAdmin');
const bc = require('bcryptjs');
const User = require('../../models/User');
// const { check, validationResult } = require('express-validator');
const router = express.Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
 try {
  const profile = await Profile.findOne({
   user: req.user.id,
  }).populate('user', ['email']);
  if (!profile) {
   return res.status(400).json({
    errors: [{ msg: "Il n'y a pas encore de profil pour cet utilisateur" }],
   });
  }
  return res.json(profile);
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Server Error');
 }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
 const { form, settings, lists, social } = req.body;
 if (!form && !settings && !lists && !social) {
  return res.status(400).json({ errors: [{ msg: 'Bad request' }] });
 }

 // Build Profile object
 const profileFields = {};
 profileFields.user = req.user.id;

 if (form) {
  const { prenom, nom, dateOfBirth, birthLocation, adresse, phoneNumber } =
   form;
  if (prenom) profileFields.prenom = prenom;
  if (nom) profileFields.nom = nom;
  if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
  if (birthLocation) profileFields.birthLocation = birthLocation;
  if (adresse) profileFields.adresse = adresse;
  if (phoneNumber) profileFields.phoneNumber = phoneNumber;
 }
 try {
  let profile = await Profile.findOne({ user: req.user.id });
  if (profile) {
   //! Update
   profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: profileFields },
    { new: true }
   ).populate('user', ['username']);
   return res.json(profile);
  }

  // new user error
  throw new Error({ message: 'No user found...' });
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Serer Error');
 }
});

// @route   PUT api/profile/:id
// @desc    Update user profile by id
// @access  Private
router.put('/:id', [authAdmin], async (req, res) => {
 const { prenom, nom, dateOfBirth, birthLocation, adresse, phoneNumber, user } =
  req.body;

 // Build Profile object
 const profileFields = {};
 if (prenom) profileFields.prenom = prenom;
 if (nom) profileFields.nom = nom;
 if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
 if (birthLocation) profileFields.birthLocation = birthLocation;
 if (adresse) profileFields.adresse = adresse;
 if (phoneNumber) profileFields.phoneNumber = phoneNumber;

 try {
  let profile = await Profile.findById(req.params.id);
  if (profile) {
   //! Update
   if (user.username) {
    var ouser = await User.findOne({ username: user.username });
    if (ouser)
     return res.status(404).json({
      errors: [{ msg: "Un utilisateur avec le meme 'email' existe deja" }],
     });
   }
   if (user.password) {
    if (user.password.length >= 6) {
     const salt = await bc.genSalt(10);
     user.password = await bc.hash(user.password, salt);
    } else {
     return res.status(400).json({
      errors: [{ msg: 'Mot de passe doit contenir 6 caractères ou plus' }],
     });
    }
   }
   await User.findByIdAndUpdate(profile.user, { $set: user }, { new: true });
   profile = await Profile.findByIdAndUpdate(
    req.params.id,
    { $set: profileFields },
    { new: true }
   );
   let profiles = await Profile.find().populate('user', [
    'username',
    'isEnabled',
   ]);
   return res.json(profiles);
  }

  return res.status(404).json({
   errors: [{ msg: 'Aucun utilisateur trouvé' }],
  });
 } catch (err) {
  // console.error(err);
  console.error(err.message);
  res.status(500).send('Erreur de serveur');
 }
});

// router.put('/:id', authAdmin, async (req, res) => {
//  // Build Profile object
//  const profileFields = {};
//  const profileFieldsUser = {};
//  profileFields.user = req.params.id;

//  const {
//   prenom,
//   nom,
//   dateOfBirth,
//   birthLocation,
//   adresse,
//   phoneNumber,
//   password,
//   email,
//  } = req.body;
//  if (prenom) profileFields.prenom = prenom;
//  if (nom) profileFields.nom = nom;
//  if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
//  if (birthLocation) profileFields.birthLocation = birthLocation;
//  if (adresse) profileFields.adresse = adresse;
//  if (phoneNumber) profileFields.phoneNumber = phoneNumber;
//  if (password) {
//   if (password.length >= 6) {
//    const salt = await bc.genSalt(10);
//    profileFieldsUser.password = await bc.hash(password, salt);
//   } else {
//    return res.status(400).json({
//     errors: [{ msg: 'Mot de passe doit contenir 6 caractères ou plus' }],
//    });
//   }
//  }
//  if (email) {
//   var ouser = await User.findOne({ email });
//   if (ouser)
//    return res.status(404).json({
//     errors: [{ msg: "Un utilisateur avec le meme 'email' existe deja" }],
//    });
//   profileFieldsUser.email = email;
//  }

//  try {
//   let profile = await Profile.findById(req.params.id);
//   if (profile) {
//    //! Update
//    await User.findByIdAndUpdate(
//     profile.user,
//     { $set: profileFieldsUser },
//     { new: true }
//    );
//    profile = await Profile.findByIdAndUpdate(
//     req.params.id,
//     { $set: profileFields },
//     { new: true }
//    ).populate('user', ['email']);
//    return res.json(profile);
//   }

//   // new user error
//   throw new Error({ message: 'No user found...' });
//  } catch (err) {
//   console.error(err.message);
//   res.status(500).send('Serer Error');
//  }
// });

// @route   GET api/profile
// @desc    Get all profiles
// @access  Private
router.get('/', authAny, async (req, res) => {
 try {
  let profiles = await Profile.find().populate('user', ['email']);
  if (!profiles) {
   return res.status(500).send('Server Error');
  }
  return res.json(profiles);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send('Server Error');
 }
});

// @route   GET api/profile/:user_id
// @desc    Get profile by user ID
// @access  Private
router.get('/:user_id', authAny, async (req, res) => {
 try {
  const profile = await Profile.findOne({ user: req.params.user_id })
   .populate('user', ['email'])
   .select('-date');
  if (!profile) {
   return res.status(400).send('Aucun profil trouvé');
  }
  return res.json(profile);
 } catch (err) {
  console.error(err.message);
  if (err.kind == 'ObjectId')
   return res.status(400).send('Aucun profil trouvé');
  return res.status(500).send('Server Error');
 }
});

module.exports = router;
