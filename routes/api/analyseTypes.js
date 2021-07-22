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
 [[check('nom', 'Un nom est requis').not().isEmpty()]],
 async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }
  // console.log(req.body);
  const { nom, description, genes } = req.body;

  // Build object
  const fields = {};
  fields.nom = nom;
  if (description) fields.description = description;
  if (genes) fields.genes = genes;

  try {
   let analyseType = await AnalyseType.findOne({ nom });
   if (analyseType) {
    return res
     .status(400)
     .json({ errors: [{ msg: "Ce type d'analyse existe deja." }] });
   }

   // Create
   analyseType = new AnalyseType(fields);
   await analyseType.save();
   const types = await AnalyseType.find().populate('genes').exec();
   return res.json(types);
  } catch (err) {
   console.error(err.message);
   res.status(500).send({ msg: 'Erreur de serveur' });
  }
 }
);

// @route   PUT api/analyseTypes/:id
// @desc    Updates a type
// @access  Private
router.put('/:id', authAdmin, async (req, res) => {
 const { nom, description, genes } = req.body;

 // Build object
 const fields = {};
 if (nom) fields.nom = nom;
 if (description) fields.description = description;
 if (genes) fields.genes = genes;

 try {
  let analyseType = await AnalyseType.findById(req.params.id);
  if (!analyseType)
   return res.status(404).json({ errors: [{ msg: 'Type non trouvé' }] });

  let analyseType2 = await AnalyseType.findOne({ nom });
  if (
   analyseType2 &&
   analyseType2.nom === nom &&
   !req.params.id.match(analyseType2._id)
  )
   return res
    .status(400)
    .json({ errors: [{ msg: 'Un type avec le même nom éxiste dèja' }] });

  // Update
  analyseType = await AnalyseType.findByIdAndUpdate(
   req.params.id,
   { $set: fields },
   { new: true }
  );
  const types = await AnalyseType.find().populate('genes').exec();
  return res.json(types);
 } catch (err) {
  console.error(err.message);
  res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

// @route   GET api/analyseTypes
// @desc    Get all types
// @access  Private
router.get('/', authAny, async (req, res) => {
 try {
  let types = await AnalyseType.find().populate('genes').exec();
  return res.json(types);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

// @route   DELETE api/analyseTypes/:id
// @desc    Deletes a type
// @access  Private
router.delete('/:id', authAny, async (req, res) => {
 try {
  await AnalyseType.findByIdAndRemove(req.params.id);
  const types = await AnalyseType.find().populate('genes').exec();
  return res.json(types);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

module.exports = router;
