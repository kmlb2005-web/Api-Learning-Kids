const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Test", testSchema);
