const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const AnalyseSchema = new mongoose.Schema({
 locationDePrelevement: {
  type: String,
  required: [true, 'Il manque la location de prélèvement.'],
 },
 type: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'analyseType',
  required: [true, "Le type d'analyse est nécéssaire."],
 },
 patient: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'userProfile',
  required: [true, 'Il faut préciser le patient.'],
 },
 user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'adminProfile',
  required: [true, "Il faut préciser l'admin responsable pour ce prélèvement."],
 },
 description: {
  type: String,
  default: '',
 },
 notes: {
  type: String,
  default: '',
 },
 etat: {
  type: Number,
  min: -1,
  max: 1,
  default: -1,
 },
 positive: {
  type: Boolean,
  default: false,
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

AnalyseSchema.plugin(mongoosePaginate);

module.exports = Analyse = mongoose.model('analyse', AnalyseSchema);
