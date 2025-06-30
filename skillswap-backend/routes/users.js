// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/search", async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Search query is empty" });
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: new RegExp(name, "i") } },
        { name: { $regex: new RegExp(name, "i") } },
      ],
    }).select("username name _id photo");

    res.json(users);
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
