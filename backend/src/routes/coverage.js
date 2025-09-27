import express from "express";
import User from "../models/User.js";
import PTORequest from "../models/PTORequest.js";
import CoverageRule from "../models/CoverageRule.js";

const router = express.Router();

// GET /api/coverage?team=Core&from=2025-10-01&to=2025-10-07
router.get("/", async (req, res) => {
  try {
    const { team, from, to } = req.query;
    if (!team || !from || !to) {
      return res.status(400).json({ error: "team, from, to are required" });
    }

    const start = new Date(from);
    const end = new Date(to);

    // team members count by role
    const members = await User.find({ team });
    const byRole = members.reduce((acc, m) => {
      acc[m.role] = (acc[m.role] || 0) + 1;
      return acc;
    }, {});

    // coverage rule
    const rule = await CoverageRule.findOne({ team });

    // PTOs overlapping
    const overlapping = await PTORequest.find({
      team,
      status: { $in: ["approved", "pending"] },
      startDate: { $lte: end },
      endDate: { $gte: start }
    });

    const offByRole = overlapping.reduce((acc, r) => {
      acc[r.role] = (acc[r.role] || 0) + 1;
      return acc;
    }, {});

    const details = {};
    for (const role of Object.keys(byRole)) {
      const min = parseInt((rule?.minOnDuty?.get(role) ?? 1), 10);
      const teamCount = byRole[role];
      const off = offByRole[role] || 0;
      const maxAllowedOff = Math.max(teamCount - min, 0);
      const risk = off > maxAllowedOff;

      details[role] = { teamCount, minOnDuty: min, off, maxAllowedOff, risk };
    }

    res.json({ team, window: { from: start, to: end }, details });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
