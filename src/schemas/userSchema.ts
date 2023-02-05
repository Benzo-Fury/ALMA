import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  money: {
    type: String,
    required: true
  },
  trevorAllowed: {
    type: Boolean,
    required: true,
    default: false
  }
});

export default mongoose.model("Users", userSchema);