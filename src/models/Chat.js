const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  title: { type: String },
  creationDate: { type: Date, default: Date.now },
  lastUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", chatSchema);
