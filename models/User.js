const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    min: 8,
    max: 30,
    required: true,
  },
  location: {
    type: String,
    min: 8,
    max: 100,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarURL: {
    type: String,
    min: 8,
    max: 100,
    required: false,
  },
  birthday: {
    type: Date,
    required: false,
  },
  freetext: {
    type: String,
    min: 8,
    max: 1000,
    required: false,
  },
  nativelang: {
    type: String,
    min: 8,
    max: 30,
    required: true,
  },
  otherlangs: {
    type: String,
    min: 8,
    max: 30,
    required: false,
  },
  learnlangs: {
    type: String,
    min: 8,
    max: 30,
    required: true,
  },
  interests: {
    type: String,
    min: 8,
    max: 30,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
