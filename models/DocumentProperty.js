const mongoose = require('mongoose');

const DocumentPropertySchema = new mongoose.Schema({
 key: {
  type: String,
  required: [true, 'La clé est requise'],
  unique: true,
 },
 value: {
  type: String,
  required: [true, 'La valeur est requise'],
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = DocumentProperty = mongoose.model(
 'documentProperty',
 DocumentPropertySchema
);
