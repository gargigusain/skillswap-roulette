const express = require("express");
const router = express.Router();
const Swap = require("../models/Swap");
const verifyToken = require("../middleware/auth");

// 📝 Create a new skill swap
router.post("/", verifyToken, async (req, res) => {
  try {
    const { skillOffered, skillWanted, description } = req.body;

    const newSwap = new Swap({
      user: req.user.id,
      skillOffered,
      skillWanted,
      description,
    });

    await newSwap.save();
    res.status(201).json({ message: "Swap posted successfully", swap: newSwap });
  } catch (err) {
    console.error("❌ POST Swap Error:", err);
    res.status(500).json({ error: "Failed to post swap" });
  }
});

// 📄 Get all skill swaps
router.get("/", verifyToken, async (req, res) => {
  try {
    const swaps = await Swap.find().populate("user", "username email");
    res.json(swaps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch swaps" });
  }
});

// ✅ Get a single swap by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id).populate("user", "username email");
    if (!swap) return res.status(404).json({ message: "Swap not found" });
    res.json(swap);
  } catch (err) {
    console.error("GET /swaps/:id error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// 🗑️ DELETE /api/swaps/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    if (swap.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await swap.deleteOne();
    res.json({ message: "Swap deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ PUT /api/swaps/:id
router.put("/:id", verifyToken, async (req, res) => {
  const { skillOffered, skillWanted, description } = req.body;

  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    if (swap.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    swap.skillOffered = skillOffered || swap.skillOffered;
    swap.skillWanted = skillWanted || swap.skillWanted;
    swap.description = description || swap.description;

    await swap.save();
    res.json({ message: "Swap updated", swap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
