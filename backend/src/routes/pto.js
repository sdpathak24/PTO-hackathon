import express from "express";
import User from "../models/User.js";
import PTORequest from "../models/PTORequest.js";
import CoverageRule from "../models/CoverageRule.js";

const router = express.Router();

// create a PTO request with coverage check
router.post("/", async (req, res) => {
  try {
    const { email, startDate, endDate, reason } = req.body;
    if (!email || !startDate || !endDate) {
      return res.status(400).json({ error: "email, startDate, endDate are required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || start > end) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    // get team size for this role
    const teamCount = await User.countDocuments({ team: user.team, role: user.role });

    // get coverage rule
    const rule = await CoverageRule.findOne({ team: user.team });
    const minOnDuty = parseInt((rule?.minOnDuty?.get(user.role) ?? 1), 10); // default = 1 if not set
    const maxAllowedOff = Math.max(teamCount - minOnDuty, 0);

    // find overlapping approved or pending PTOs
    const overlapping = await PTORequest.countDocuments({
      team: user.team,
      role: user.role,
      status: { $in: ["approved", "pending"] },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    let suggestion = "Looks safe to approve.";
    let risk = false;
    if (overlapping >= maxAllowedOff) {
      risk = true;
      suggestion = `⚠️ Coverage risk: ${overlapping} already off in ${user.role} (${user.team}). Min on-duty = ${minOnDuty}.`;
    }

    const pto = await PTORequest.create({
      user: user._id,
      role: user.role,
      team: user.team,
      startDate: start,
      endDate: end,
      reason
    });

    res.json({ pto, analysis: { teamCount, minOnDuty, maxAllowedOff, overlapping, risk, suggestion } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// list all PTOs
router.get("/", async (_req, res) => {
  const requests = await PTORequest.find().populate("user").sort({ startDate: 1 });
  res.json(requests);
});

// update PTO status (approve/deny/pending)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "denied", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await PTORequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user");

    if (!updated) return res.status(404).json({ error: "PTO not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
