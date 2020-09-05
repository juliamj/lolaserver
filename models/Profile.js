const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const ProfileImage = new mongoose.Schema(
//   {
//     avatar: {
//       type: String,
//       required: true,
//     },
//     userId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // name: {
  //   type: String,
  //   required: false,
  // },
  debugName: {
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
  profileImg: {
    type: String,
    required: false,
  },
  birthday: {
    type: Date,
    required: false,
  },
  days: {
    type: Number,
    required: false,
  },
  months: {
    type: String,
    required: false,
  },
  years: {
    type: Number,
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
    required: false,
  },
  // otherlangs: {
  //   type: Array,
  //   required: false,
  // },
  learnlangs: {
    type: Array,
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
