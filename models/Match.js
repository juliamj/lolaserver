const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
content: {
    type: String,
    required: true,
},
authorId: {
    type: Schema.Types.ObjectId,
    required: true,
},

}, {timestamps: true})

const MatchSchema = new mongoose.Schema({
  initialMatchCriteria: {
    type: Array,
    required: true,
  },
  groupName: {
    type: String,
    required: false,
  },
  users: {
      type: Array,
      required: true,
  },
  messages: {
    type: [MessageSchema],
    required: true,
},
})

const Match = mongoose.model("matches", MatchSchema);

module.exports = Match