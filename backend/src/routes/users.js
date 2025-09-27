import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, role, team } = req.body;
    if (!name || !email || !role || !team) {
      return res.status(400).json({ error: "name, email, role, team are required" });
    }
    const user = await User.create({ name, email, role, team });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
router.get("/", async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

export default router;
