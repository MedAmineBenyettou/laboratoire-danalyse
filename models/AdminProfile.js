const mongoose = require('mongoose');

const AdminProfileSchema = new mongoose.Schema({
 user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'admin',
  required: [true, 'Admin not provided!!'],
  unique: true,
 },
 nom: {
  type: String,
 },
 prenom: {
  type: String,
 },
 fonction: {
  type: String,
 },
 phoneNumber: {
  type: mongoose.Schema.Types.Number,
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = AdminProfile = mongoose.model(
 'adminProfile',
 AdminProfileSchema
);
