// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills:   { type: [String], default: [] },
  photo:    { type: String, default: "https://via.placeholder.com/40" }  // ✅ added
});

module.exports = mongoose.model("User", userSchema);
