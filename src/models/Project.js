const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  grade: { type: String, required: true },
  educationalFieldId: { type: mongoose.Schema.Types.ObjectId, ref: "EducationalField", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);
