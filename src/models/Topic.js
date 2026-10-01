const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true }
});

module.exports = mongoose.model("Topic", topicSchema);
