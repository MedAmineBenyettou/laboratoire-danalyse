const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
 username: {
  type: String,
  required: [true, "Nom d'utilisateur requis"],
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

module.exports = Admin = mongoose.model('admin', AdminSchema);
