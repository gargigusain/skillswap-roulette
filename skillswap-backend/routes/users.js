const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 🔍 Search users by username (case-insensitive)
router.get("/search", async (req, res) => {
  const { name } = req.query;

  try {
    const users = await User.find({
      username: { $regex: new RegExp(name, "i") }, // 👈 case-insensitive search
    }).select("username _id photo"); // 👈 return username, id, and photo

    res.json(users);
  } catch (err) {
    console.error("❌ User search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
