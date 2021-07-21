const express = require('express');
const { Gene } = require('../../../models/Gene');
const authAdmin = require('../../../middlewares/authAdmin');
const authAny = require('../../../middlewares/authAny');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// @route   POST api/admin/genes
// @desc    Creates a gene
// @access  Private
router.post(
 '/',
 authAdmin,
 [[check('nom', 'Un nom pour le gêne est requis').not().isEmpty()]],
 async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  const { nom, description } = req.body;

  // Build object
  const fields = {};
  fields.nom = nom;
  if (description) fields.description = description;

  try {
   let gene = await Gene.findOne({ nom });
   if (gene) {
    return res
     .status(203)
     .json({ errors: [{ msg: 'Ce type de gêne existe deja.' }] });
   }

   // Create
   gene = new Gene(fields);
   await gene.save();
   const genes = await Gene.find();
   return res.json(genes);
  } catch (err) {
   console.error(err.message);
   return res.status(500).send({ msg: 'Erreur de serveur' });
  }
 }
);

// @route   POST api/admin/genes/:id
// @desc    Updates a gene
// @access  Private
router.put('/:id', authAdmin, async (req, res) => {
 const { nom, description } = req.body;

 // Build object
 const fields = {};
 if (nom) fields.nom = nom;
 if (description) fields.description = description;

 try {
  let gene = await Gene.findById(req.params.id);
  if (!gene)
   return res.status(404).json({ errors: [{ msg: 'Gêne non trouvé' }] });

  let gene2 = await Gene.findOne({ nom });
  if (gene2 && gene2.nom === nom && !req.params.id.match(gene2._id))
   return res
    .status(403)
    .json({ errors: [{ msg: 'Un gêne avec le même nom éxiste dèja' }] });

  // Update
  gene = await Gene.findByIdAndUpdate(
   req.params.id,
   { $set: fields },
   { new: true }
  );
  // console.log(gene);
  const genes = await Gene.find();
  return res.json(genes);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

// @route   GET api/admin/genes
// @desc    Get all genes
// @access  Private
router.get('/', authAny, async (req, res) => {
 try {
  let types = await Gene.find();

  return res.json(types);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

// @route   DELETE api/admin/genes/:id
// @desc    Deletes a gene
// @access  Private
router.delete('/:id', authAny, async (req, res) => {
 try {
  await Gene.findByIdAndRemove(req.params.id);
  const genes = await Gene.find();
  return res.json(genes);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

module.exports = router;
