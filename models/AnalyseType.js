const mongoose = require('mongoose');
const { GeneSchema } = require('./Gene');

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
 genes: [
  {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'gene',
  },
 ],
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = AnalyseType = mongoose.model('analyseType', AnalyseTypeSchema);
