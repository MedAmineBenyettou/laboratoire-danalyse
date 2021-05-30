const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
 user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user',
  required: [true, 'User not provided!!'],
  unique: true,
 },
 nom: {
  type: String,
  required: [true, 'Le nom est requis'],
 },
 prenom: {
  type: String,
  required: [true, 'Le prenom est requis'],
 },
 dateOfBirth: {
  type: Date,
  required: [true, 'Le lieu de naissance est requis'],
 },
 birthLocation: {
  type: String,
  required: [true, 'location not provided'],
 },
 adresse: {
  type: String,
  required: [true, "L'adresse est requise"],
 },
 phoneNumber: {
  type: mongoose.Schema.Types.Number,
  required: [true, 'Un numéro de téléphone est requis'],
  unique: true,
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = UserProfile = mongoose.model('userProfile', UserProfileSchema);
