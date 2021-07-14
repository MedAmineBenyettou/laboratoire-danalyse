const mongoose = require('mongoose');
const { GeneSchema, Gene } = require('./Gene');

const AnalyseTypeSchema = new mongoose.Schema({
 nom: {
  type: String,
  required: [true, 'Un nom est requis'],
  unique: true,
 },
 description: {
  type: String,
  default: '',
 },
 genes: [GeneSchema],
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = AnalyseType = mongoose.model('analyseType', AnalyseTypeSchema);
