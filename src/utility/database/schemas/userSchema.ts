import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    default: 0,
    required: true
  },
  trevorAllowed: {
    type: Boolean,
    required: true,
    default: false
  },
  userMemory: {
    type: Array,
    required: true,
    default: []
  }
});

export default mongoose.model("Users", userSchema);