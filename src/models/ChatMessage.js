const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  role: { type: String, required: true, enum: ["STUDENT", "AI"] },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
