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
  profileImg: {
    type: String,
    required: false,
  },
  birthday: {
    type: Date,
    required: false,
  },
  freetext1: {
    type: String,
    min: 8,
    max: 1000,
    required: false,
  },
  freetext2: {
    type: String,
    min: 8,
    max: 1000,
    required: false,
  },
  freetext3: {
    type: String,
    min: 8,
    max: 1000,
    required: false,
  },
  nativelang: {
    type: Array,
    required: false,
  },
  learnlangs: {
    type: Array,
    required: false,
  },
  interests: {
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
