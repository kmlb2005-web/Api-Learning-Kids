const mongoose = require("mongoose");

const educationalResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true, enum: ["PDF", "DOCX", "PPTX", "IMAGE", "VIDEO", "LINK"] },
  url: { type: String, required: true },
  fileName: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EducationalResource", educationalResourceSchema);
