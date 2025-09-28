import express from "express";
import LeavePolicy from "../models/LeavePolicy.js";
import LeaveBalance from "../models/LeaveBalance.js";
import User from "../models/User.js";
import { getAthenaRecommendation } from "../services/aiService.js";

const router = express.Router();

// Create or update leave policy for a role
router.post("/leave-policy", async (req, res) => {
  try {
    const { role, leaveCategories, year } = req.body;
    
    if (!role || !leaveCategories) {
      return res.status(400).json({ error: "Role and leave categories are required" });
    }

    const policyData = {
      role,
      leaveCategories,
      year: year || new Date().getFullYear()
    };

    const policy = await LeavePolicy.findOneAndUpdate(
      { role, year: policyData.year },
      policyData,
      { upsert: true, new: true }
    );

    res.json(policy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all leave policies
router.get("/leave-policies", async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const policies = await LeavePolicy.find({ year, isActive: true });
    res.json(policies);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Initialize leave balance for a new employee
router.post("/employee/:userId/initialize-balance", async (req, res) => {
  try {
    const { userId } = req.params;
    const year = req.body.year || new Date().getFullYear();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get leave policy for user's role
    const policy = await LeavePolicy.findOne({ role: user.role, year });
    if (!policy) {
      return res.status(404).json({ error: "Leave policy not found for this role" });
    }

    // Determine eligible categories based on user details
    const eligibleCategories = { ...policy.leaveCategories };
    
    // Remove maternity/paternity if not eligible
    if (user.gender !== 'female' || user.maritalStatus !== 'married') {
      delete eligibleCategories.maternity;
    }
    if (user.gender !== 'male' || user.maritalStatus !== 'married') {
      delete eligibleCategories.paternity;
    }

    // Create leave balance record
    const balanceData = {
      user: userId,
      year,
      balances: {}
    };

    Object.keys(eligibleCategories).forEach(category => {
      balanceData.balances[category] = {
        allocated: eligibleCategories[category],
        used: 0,
        remaining: eligibleCategories[category]
      };
    });

    const leaveBalance = await LeaveBalance.findOneAndUpdate(
      { user: userId, year },
      balanceData,
      { upsert: true, new: true }
    );

    res.json(leaveBalance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all employee leave balances (for HR overview)
router.get("/leave-balances", async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const balances = await LeaveBalance.find({ year }).populate('user');
    res.json(balances);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// HR Analytics - Get leave trends and insights
router.get("/analytics", async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    
    // Get all users with their balances
    const balances = await LeaveBalance.find({ year }).populate('user');
    
    // Calculate analytics
    const analytics = {
      totalEmployees: balances.length,
      totalLeaveDaysAllocated: 0,
      totalLeaveDaysUsed: 0,
      categoryBreakdown: {},
      roleBreakdown: {},
      utilizationRate: 0
    };

    balances.forEach(balance => {
      Object.keys(balance.balances).forEach(category => {
        const catData = balance.balances[category];
        
        if (!analytics.categoryBreakdown[category]) {
          analytics.categoryBreakdown[category] = { allocated: 0, used: 0, remaining: 0 };
        }
        
        analytics.categoryBreakdown[category].allocated += catData.allocated;
        analytics.categoryBreakdown[category].used += catData.used;
        analytics.categoryBreakdown[category].remaining += catData.remaining;
        
        analytics.totalLeaveDaysAllocated += catData.allocated;
        analytics.totalLeaveDaysUsed += catData.used;
      });

      // Role breakdown
      const role = balance.user.role;
      if (!analytics.roleBreakdown[role]) {
        analytics.roleBreakdown[role] = { employees: 0, totalAllocated: 0, totalUsed: 0 };
      }
      analytics.roleBreakdown[role].employees += 1;
      
      Object.values(balance.balances).forEach(catData => {
        analytics.roleBreakdown[role].totalAllocated += catData.allocated;
        analytics.roleBreakdown[role].totalUsed += catData.used;
      });
    });

    analytics.utilizationRate = analytics.totalLeaveDaysAllocated > 0 
      ? (analytics.totalLeaveDaysUsed / analytics.totalLeaveDaysAllocated * 100).toFixed(1)
      : 0;

    // Get AI insights on leave trends
    const aiInsights = await getAthenaRecommendation({
      analytics: JSON.stringify(analytics),
      context: "HR Analytics",
      requestType: "leave_trends_analysis"
    });

    res.json({
      analytics,
      aiInsights: aiInsights.recommendation
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
