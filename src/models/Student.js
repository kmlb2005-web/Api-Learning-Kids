const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  grade: { type: String, required: true },
  group: { type: String },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor" }
});

module.exports = mongoose.model("Student", studentSchema);
