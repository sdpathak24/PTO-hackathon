import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import LeavePolicy from "./models/LeavePolicy.js";
import LeaveBalance from "./models/LeaveBalance.js";
import connectDB from "./db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await LeavePolicy.deleteMany({});
    await LeaveBalance.deleteMany({});
    
    console.log("🗑️ Cleared existing data");
    
    // Create sample users
    const users = [
      {
        name: "Khushi Talaviya",
        email: "khushi@example.com",
        role: "junior",
        team: "Core",
        gender: "female",
        maritalStatus: "single",
        level: "junior"
      },
      {
        name: "Manager Smith",
        email: "manager@example.com",
        role: "manager",
        team: "Core",
        gender: "male",
        maritalStatus: "married",
        level: "manager"
      },
      {
        name: "HR Admin",
        email: "hr@example.com",
        role: "hr",
        team: "HR",
        gender: "female",
        maritalStatus: "married",
        level: "hr"
      },
      {
        name: "John Intern",
        email: "intern@example.com",
        role: "intern",
        team: "Core",
        gender: "male",
        maritalStatus: "single",
        level: "intern"
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log("👥 Created sample users");
    
    // Create leave policies
    const currentYear = new Date().getFullYear();
    const policies = [
      {
        role: "intern",
        year: currentYear,
        leaveCategories: {
          personal: 5,
          sick: 5,
          bereavement: 3,
          maternity: 0,
          paternity: 0
        },
        isActive: true
      },
      {
        role: "junior",
        year: currentYear,
        leaveCategories: {
          personal: 10,
          sick: 10,
          bereavement: 5,
          maternity: 0,
          paternity: 0
        },
        isActive: true
      },
      {
        role: "senior",
        year: currentYear,
        leaveCategories: {
          personal: 15,
          sick: 12,
          bereavement: 7,
          maternity: 0,
          paternity: 0
        },
        isActive: true
      },
      {
        role: "manager",
        year: currentYear,
        leaveCategories: {
          personal: 20,
          sick: 15,
          bereavement: 10,
          maternity: 0,
          paternity: 10
        },
        isActive: true
      },
      {
        role: "director",
        year: currentYear,
        leaveCategories: {
          personal: 25,
          sick: 20,
          bereavement: 15,
          maternity: 0,
          paternity: 15
        },
        isActive: true
      }
    ];
    
    const createdPolicies = await LeavePolicy.insertMany(policies);
    console.log("📋 Created leave policies");
    
    // Create leave balances for users
    for (const user of createdUsers) {
      const policy = createdPolicies.find(p => p.role === user.role);
      if (policy) {
        // Determine eligible categories based on user details
        const eligibleCategories = { ...policy.leaveCategories };
        
        // Remove maternity/paternity if not eligible
        if (user.gender !== 'female' || user.maritalStatus !== 'married') {
          delete eligibleCategories.maternity;
        }
        if (user.gender !== 'male' || user.maritalStatus !== 'married') {
          delete eligibleCategories.paternity;
        }
        
        const balanceData = {
          user: user._id,
          year: currentYear,
          balances: {}
        };
        
        Object.keys(eligibleCategories).forEach(category => {
          balanceData.balances[category] = {
            allocated: eligibleCategories[category],
            used: Math.floor(Math.random() * 3), // Random used days (0-2)
            remaining: eligibleCategories[category] - Math.floor(Math.random() * 3)
          };
        });
        
        await LeaveBalance.create(balanceData);
      }
    }
    
    console.log("💰 Created leave balances");
    console.log("✅ Sample data seeded successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
