const express = require('express');
const AnalyseType = require('../../models/AnalyseType');
const authAdmin = require('../../middlewares/authAdmin');
const authAny = require('../../middlewares/authAny');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// @route   POST api/analyseTypes
// @desc    Creates a type
// @access  Private
router.post(
 '/',
 authAdmin,
 [
  [
   check('nom', 'Un nom est requis').not().isEmpty(),
   check('description', 'Une description est requise').not().isEmpty(),
  ],
 ],
 async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  const { nom, description } = req.body;

  // Build object
  const fields = {};
  fields.nom = nom;
  fields.description = description;

  try {
   let analyseType = await AnalyseType.findOne({ nom });
   if (analyseType) {
    return res
     .status(203)
     .json({ errors: [{ msg: "Ce type d'analyse existe deja." }] });
   }

   // Create
   analyseType = new AnalyseType(fields);
   await analyseType.save();
   return res.json(analyseType);
  } catch (err) {
   console.error(err.message);
   res.status(500).send('Erreur de serveur');
  }
 }
);

// @route   POST api/analyseTypes/:id
// @desc    Updates a type
// @access  Private
router.put('/', authAdmin, async (req, res) => {
 const { nom, description } = req.body;

 // Build object
 const fields = {};
 if (nom) fields.nom = nom;
 if (description) fields.description = description;

 try {
  let analyseType = await AnalyseType.findOne({ nom });
  if (analyseType) {
   return res
    .status(203)
    .json({ errors: [{ msg: "Ce type d'analyse existe deja." }] });
  }

  // Update
  analyseType = await AnalyseType.findByIdAndUpdate(
   req.params.id,
   { $set: fields },
   { new: true }
  );
  return res.json(analyseType);
 } catch (err) {
  console.error(err.message);
  res.status(500).send('Erreur de serveur');
 }
});

// @route   GET api/analyseTypes
// @desc    Get all types
// @access  Private
router.get('/', authAny, async (req, res) => {
 try {
  let types = await AnalyseType.find();
  if (!types) {
   return res.status(500).send('Erreur de serveur');
  }
  return res.json(types);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send('Erreur de serveur');
 }
});

module.exports = router;
