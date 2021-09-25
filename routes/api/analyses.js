const express = require('express');
const authAdmin = require('../../middlewares/authAdmin');
const authAny = require('../../middlewares/authAny');
const AdminProfile = require('../../models/AdminProfile');
const Analyse = require('../../models/Analyse');
const router = express.Router();

const analyseQuery = [
 {
  path: 'type',
  populate: 'genes',
 },
 {
  path: 'patient',
  populate: {
   path: 'user',
   select: '-password',
  },
 },
 {
  path: 'user',
  populate: {
   path: 'user',
   select: '-password',
  },
 },
];

// @route   POST api/analyse
// @desc    Creates an Analyse
// @access  Private
router.post('/', authAdmin, async (req, res) => {
 // console.log(req.body);
 const {
  locationDePrelevement,
  description,
  type,
  patient,
  notes,
  etat,
  positive,
 } = req.body;

 // Build object

 try {
  const fields = {};
  fields.user = (await AdminProfile.findOne({ user: req.admin.id }))._id;
  if (description) fields.description = description;
  if (locationDePrelevement)
   fields.locationDePrelevement = locationDePrelevement;
  if (type) fields.type = type;
  if (patient) fields.patient = patient;
  if (notes) fields.notes = notes;
  if (etat !== undefined) fields.etat = etat;
  if (positive !== undefined) fields.positive = positive;
  // Create
  var analyse = new Analyse(fields);
  await analyse.save();
  let temps = await Analyse.paginate(
   {},
   {
    sort: { date: -1 },
    limit: 15,
    page: req.query.page,
    populate: analyseQuery,
    pagination: req.query.page && req.query.page > 0,
   }
  );
  temps = {
   data: temps.docs,
   params: {
    totalDocs: temps.totalDocs,
    totalPages: temps.totalPages,
    limit: temps.limit,
    page: temps.page,
    nextPage: temps.nextPage,
    prevPage: temps.prevPage,
   },
  };
  return res.json(temps);
 } catch (err) {
  console.error(err.message);
  res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

// @route   PUT api/analyse/:id
// @desc    Updates an Analyse
// @access  Private
router.put('/:id', authAdmin, async (req, res) => {
 const {
  locationDePrelevement,
  description,
  type,
  patient,
  notes,
  etat,
  positive,
 } = req.body;

 // Build object
 const fields = {};
 fields.user = (await AdminProfile.findOne({ user: req.admin.id }))._id;
 if (description) fields.description = description;
 if (locationDePrelevement)
  fields.locationDePrelevement = locationDePrelevement;
 if (type) fields.type = type;
 if (patient) fields.patient = patient;
 if (notes) fields.notes = notes;
 if (etat !== undefined) fields.etat = etat;
 if (positive !== undefined) fields.positive = positive;

 try {
  let analyse = await Analyse.findById(req.params.id);
  if (!analyse)
   return res.status(404).json({ errors: [{ msg: 'Analyse non trouvé' }] });

  // Update
  analyse = await Analyse.findByIdAndUpdate(
   req.params.id,
   { $set: fields },
   { new: true }
  );
  let temps = await Analyse.paginate(
   {},
   {
    sort: { date: -1 },
    limit: 15,
    page: req.query.page,
    populate: analyseQuery,
    pagination: req.query.page && req.query.page > 0,
   }
  );
  temps = {
   data: temps.docs,
   params: {
    totalDocs: temps.totalDocs,
    totalPages: temps.totalPages,
    limit: temps.limit,
    page: temps.page,
    nextPage: temps.nextPage,
    prevPage: temps.prevPage,
   },
  };
  return res.json(temps);
 } catch (err) {
  console.error(err.message);
  res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

// @route   GET api/analyse
// @desc    Get all Analyses
// @access  Private
router.get('/', authAny, async (req, res) => {
 //*  console.log(req.query);
 try {
  let temps = await Analyse.paginate(
   {},
   {
    sort: { date: -1 },
    limit: 15,
    page: req.query.page,
    populate: analyseQuery,
    pagination: req.query.page && req.query.page > 0,
   }
  );
  temps = {
   data: temps.docs,
   params: {
    totalDocs: temps.totalDocs,
    totalPages: temps.totalPages,
    limit: temps.limit,
    page: temps.page,
    nextPage: temps.nextPage,
    prevPage: temps.prevPage,
   },
  };
  return res.json(temps);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

// @route   DELETE api/analyse/:id
// @desc    Deletes an Analyse
// @access  Private
router.delete('/:id', authAdmin, async (req, res) => {
 try {
  await Analyse.findByIdAndRemove(req.params.id);
  let temps = await Analyse.paginate(
   {},
   {
    sort: { date: -1 },
    limit: 15,
    page: req.query.page,
    populate: analyseQuery,
    pagination: req.query.page && req.query.page > 0,
   }
  );
  temps = {
   data: temps.docs,
   params: {
    totalDocs: temps.totalDocs,
    totalPages: temps.totalPages,
    limit: temps.limit,
    page: temps.page,
    nextPage: temps.nextPage,
    prevPage: temps.prevPage,
   },
  };
  return res.json(temps);
 } catch (err) {
  console.error(err.message);
  return res.status(500).send({ msg: 'Erreur de serveur' });
 }
});

module.exports = router;
