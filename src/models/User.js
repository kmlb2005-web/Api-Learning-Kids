const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["ADMIN", "TEACHER", "STUDENT"] },
  email: { type: String },
  registrationDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model("User", userSchema);
