const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  answer: { type: String, required: true },
  correct: { type: Boolean, required: true }
}, { _id: false });

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  grade: { type: Number, required: true },
  attempt: { type: Number, required: true, min: 1 },
  answers: { type: [answerSchema], default: [] },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);
