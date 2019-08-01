const mongoose = require('mongoose');


const GoogleUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const GoogleUser = mongoose.model('GoogleUser', GoogleUserSchema);

module.exports = GoogleUser;
