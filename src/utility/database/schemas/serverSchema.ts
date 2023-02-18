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
  },
  welcomeChannel: {
    type: String,
    required: true
  },
  welcomeAIPersonality: {
    type: String,
    required: true,
    default: 'maria'
  }
});

export default mongoose.model("Servers", serverSchema);