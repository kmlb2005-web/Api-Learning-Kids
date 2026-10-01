const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  question: { type: String, required: true },
  type: { type: String, required: true, enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "OPEN"] },
  options: { type: [String] },
  correctAnswer: { type: String },
  points: { type: Number, required: true, min: 1 }
});

module.exports = mongoose.model("Question", questionSchema);
