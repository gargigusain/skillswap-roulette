const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillOffered: { type: String, required: true },     // Skill offered
  skillWanted: { type: String, required: true },      // Skill wanted
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Swap", swapSchema);
