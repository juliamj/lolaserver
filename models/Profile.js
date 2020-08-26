const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  name: {
      type: String,
      required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    min: 8,
    max: 100,
    required: false,
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
    type: Array,
    min: 8,
    max: 30,
    required: false,
  },
  otherlangs: {
    type: Array,
    min: 8,
    max: 30,
    required: false,
  },
  learnlangs: {
    type: Array,
    min: 8,
    max: 30,
    required: false,
  },
  interests: {
    //how to structure the interests? do we put the possibilities for interests here?
    type: Array,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model("Profiles", ProfileSchema);

module.exports = Profile;
