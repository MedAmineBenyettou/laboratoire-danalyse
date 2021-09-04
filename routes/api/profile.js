const express = require('express');
const Profile = require('../../models/UserProfile');
const auth = require('../../middlewares/auth');
const { check, validationResult } = require('express-validator');
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

// @route   POST api/profile
// @desc    Create user profile
// @access  Private
// router.post(
//  '/',
//  auth,
//  [
//   [
//    check('dateOfBirth', 'Une date de naissance est requise').not().isEmpty(),
//    check('phoneNumber', 'Un numéro de téléphone est requis').not().isEmpty(),
//    check('birthLocation', 'Le lieu de naissance est requis').not().isEmpty(),
//    check('adresse', "L'adresse est requise").not().isEmpty(),
//    check('nom', 'Le nom est requis').not().isEmpty(),
//    check('prenom', 'Le prenom est requis').not().isEmpty(),
//   ],
//  ],
//  async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//    return res.status(400).json({ errors: errors.array() });
//   }

//   const { prenom, nom, dateOfBirth, birthLocation, adresse, phoneNumber } =
//    req.body;
//   // Build Profile object
//   const profileFields = {};
//   profileFields.user = req.user.id;
//   profileFields.prenom = prenom;
//   profileFields.nom = nom;
//   profileFields.dateOfBirth = Date(dateOfBirth);
//   profileFields.birthLocation = birthLocation;
//   profileFields.adresse = adresse;
//   profileFields.phoneNumber = phoneNumber;

//   try {
//    let profile = await Profile.findOne({ user: req.user.id });
//    if (profile) {
//     return res
//      .status(203)
//      .json({ errors: [{ msg: 'Profile already exists...' }] });
//    }

//    // Create
//    profile = new Profile(profileFields);
//    await profile.save();
//    return res.json(profile);
//   } catch (err) {
//    console.error(err.message);
//    res.status(500).send('Server Error');
//   }
//  }
// );

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', [auth], async (req, res) => {
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

// @route   GET api/profile
// @desc    Get all profiles
// @access  Private
router.get('/', auth, async (req, res) => {
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
router.get('/:user_id', auth, async (req, res) => {
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
