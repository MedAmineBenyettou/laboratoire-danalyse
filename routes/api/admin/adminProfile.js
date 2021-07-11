const express = require('express');
const Profile = require('../../../models/AdminProfile');
const auth = require('../../../middlewares/authAdmin');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// @route   GET api/admin/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
 try {
  var profile = await Profile.findOne({
   user: req.admin.id,
  }).populate('user', ['username']);
  if (!profile) {
   profile = new Profile({ user: req.admin.id });
   await profile.save();
  }
  return res.json(profile);
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Erreur du serveur');
 }
});

// @route   POST api/admin/profile
// @desc    Create user profile
// @access  Private
router.post('/', auth, async (req, res) => {
 const { prenom, nom, phoneNumber, fonction } = req.body;
 // Build Profile object
 const profileFields = {};
 profileFields.user = req.admin.id;
 if (prenom) profileFields.prenom = prenom;
 if (nom) profileFields.nom = nom;
 if (phoneNumber) profileFields.phoneNumber = phoneNumber;
 if (fonction) profileFields.fonction = fonction;

 try {
  let profile = await Profile.findOne({ user: req.admin.id });
  if (profile) {
   return res
    .status(203)
    .json({ errors: [{ msg: 'Profile already exists...' }] });
  }

  // Create
  profile = new Profile(profileFields);
  await profile.save();
  return res.json(profile);
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Erreur du serveur');
 }
});

// @route   PUT api/admin/profile
// @desc    Update user profile
// @access  Private
router.put('/', [auth], async (req, res) => {
 const { prenom, nom, phoneNumber, fonction } = req.body;

 // Build Profile object
 const profileFields = {};
 profileFields.user = req.admin.id;

 if (prenom) profileFields.prenom = prenom;
 if (nom) profileFields.nom = nom;
 if (phoneNumber) profileFields.phoneNumber = phoneNumber;
 if (fonction) profileFields.fonction = fonction;

 try {
  let profile = await Profile.findOne({ user: req.admin.id });
  if (profile) {
   //! Update
   profile = await Profile.findOneAndUpdate(
    { user: req.admin.id },
    { $set: profileFields },
    { new: true }
   ).populate('user', ['username']);
   return res.json(profile);
  }

  // new user error
  throw new Error({ message: 'Aucun utilisateur trouvé...' });
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Erreur de serveur');
 }
});

// @route   GET api/admin/profile
// @desc    Get all profiles
// @access  Private
router.get('/', auth, async (req, res) => {
 try {
  let profiles = await Profile.find().populate('user', ['username']);
  if (!profiles) {
   return res.status(500).send('Erreur du serveur');
  }
  return res.json(profiles);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send('Erreur du serveur');
 }
});

// @route   GET api/admin/profile/:user_id
// @desc    Get profile by user ID
// @access  Private
router.get('/:user_id', auth, async (req, res) => {
 try {
  const profile = await Profile.findOne({ user: req.params.user_id })
   .populate('user', ['username'])
   .select('-date');
  if (!profile) {
   return res.status(400).send('Aucun profil trouvé');
  }
  return res.json(profile);
 } catch (err) {
  console.error(err.message);
  if (err.kind == 'ObjectId')
   return res.status(400).send('Aucun profil trouvé');
  return res.status(500).send('Erreur du serveur');
 }
});

module.exports = router;
