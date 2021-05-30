const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 email: {
  type: String,
  required: [true, 'email not provided'],
  unique: true,
 },
 password: {
  type: String,
  required: [true, 'password not provided'],
 },
 date: {
  type: Date,
  default: Date.now,
 },
});

module.exports = User = mongoose.model('user', UserSchema);
