const mongoose = require("mongoose");

const educationalFieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model("EducationalField", educationalFieldSchema);
