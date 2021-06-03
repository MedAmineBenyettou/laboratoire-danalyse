const mongoose = require('mongoose');
const DocumentProperty = require('./DocumentProperty');

const DocumentSchema = new mongoose.Schema({
 properties: {
  type: [DocumentProperty],
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = Document = mongoose.model('document', DocumentSchema);
