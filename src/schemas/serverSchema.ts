import mongoose from "mongoose";

const serverSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  AIChannel: {
    type: String,
    required: true
  },
  AIPersonality: {
    type: String,
    required: true
  }
});

export default mongoose.model("Servers", serverSchema);