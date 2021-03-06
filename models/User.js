const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 email: {
  type: String,
  required: [true, 'email requis'],
  unique: true,
 },
 password: {
  type: String,
  required: [true, 'Mot de passe requis'],
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = User = mongoose.model('user', UserSchema);
