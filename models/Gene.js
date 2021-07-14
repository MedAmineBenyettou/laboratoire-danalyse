const mongoose = require('mongoose');

const GeneSchema = new mongoose.Schema({
 nom: {
  type: String,
  required: [true, 'Un nom est requis'],
  unique: true,
 },
 description: {
  type: String,
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

const Gene = mongoose.model('gene', GeneSchema);

module.exports = { Gene, GeneSchema };
