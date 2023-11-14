const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuruSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['palmist', 'kundali'],
    required: true
  },
  rating: {
    type: Number,
  },
  fees : {
    type: Number,
    required: true,
  }

});

const Guru = mongoose.model('User', GuruSchema);

module.exports = Guru;