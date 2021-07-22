const express = require('express');
const Profile = require('../../../models/AdminProfile');
const auth = require('../../../middlewares/authAdmin');
const Admin = require('../../../models/Admin');
const router = express.Router();
const bc = require('bcryptjs');

// @route   GET api/admin/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
 try {
  var profile = await Profile.findOne({
   user: req.admin.id,
  }).populate('user', ['username', 'isEnabled']);
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
    .status(400)
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

// @route   POST api/admin/profile/:id
// @desc    Create user profile
// @access  Private
router.post('/:id', auth, async (req, res) => {
 const { prenom, nom, phoneNumber, fonction } = req.body;
 // Build Profile object
 const profileFields = {};
 profileFields.user = req.params.id;
 if (prenom) profileFields.prenom = prenom;
 if (nom) profileFields.nom = nom;
 if (phoneNumber) profileFields.phoneNumber = phoneNumber;
 if (fonction) profileFields.fonction = fonction;

 try {
  let profile = await Profile.findOne({ user: profileFields.user });
  if (profile) {
   return res
    .status(400)
    .json({ errors: [{ msg: 'Profile already exists...' }] });
  }

  // Create
  profile = new Profile(profileFields);
  await profile.save();
  let profiles = await Profile.find().populate('user', [
   'username',
   'isEnabled',
  ]);
  return res.json(profiles);
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
   ).populate('user', ['username', 'isEnabled']);
   return res.json(profile);
  }

  // new user error
  throw new Error({ message: 'Aucun utilisateur trouvé...' });
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Erreur de serveur');
 }
});

// @route   PUT api/admin/profile/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', [auth], async (req, res) => {
 const { prenom, nom, phoneNumber, fonction, user } = req.body;

 // Build Profile object
 const profileFields = {};
 if (prenom) profileFields.prenom = prenom;
 if (nom) profileFields.nom = nom;
 if (phoneNumber) profileFields.phoneNumber = phoneNumber;
 if (fonction) profileFields.fonction = fonction;

 try {
  let profile = await Profile.findById(req.params.id);
  if (profile) {
   //! Update
   if (user.username) {
    var admin = await Admin.findOne({ username: user.username });
    if (admin)
     return res.status(404).json({
      errors: [
       { msg: "Un utilisateur avec le meme 'nom d'utilisateur' existe deja" },
      ],
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
   await Admin.findByIdAndUpdate(profile.user, { $set: user }, { new: true });
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

// @route   GET api/admin/profile
// @desc    Get all profiles
// @access  Private
router.get('/', auth, async (req, res) => {
 try {
  let profiles = await Profile.find().populate('user', [
   'username',
   'isEnabled',
  ]);
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
   .populate('user', ['username', 'isEnabled'])
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
