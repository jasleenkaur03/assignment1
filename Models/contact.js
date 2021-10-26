const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Contact = new Schema({
  name: String,
  phone: String,
  email: String
});

module.exports = mongoose.model('Contacts', Contact, 'Contacts');