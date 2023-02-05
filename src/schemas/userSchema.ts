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
  AIPersonality: {
    type: String,
    required: true
  }
});

export default mongoose.model("Users", userSchema);