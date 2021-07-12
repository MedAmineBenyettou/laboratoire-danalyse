const mongoose = require('mongoose');

const AnalyseTypeSchema = new mongoose.Schema({
 nom: {
  type: String,
  required: [true, 'Un nom est requis'],
  unique: true,
 },
 description: {
  type: String,
  required: [true, 'Une description est requise'],
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = AnalyseType = mongoose.model('analyseType', AnalyseTypeSchema);
