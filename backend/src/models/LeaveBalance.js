import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    year: { type: Number, required: true, default: () => new Date().getFullYear() },
    balances: {
      personal: { 
        allocated: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 }
      },
      sick: { 
        allocated: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 }
      },
      bereavement: { 
        allocated: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 }
      },
      maternity: { 
        allocated: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 }
      },
      paternity: { 
        allocated: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        remaining: { type: Number, default: 0 }
      }
    }
  },
  { timestamps: true }
);

// Ensure one balance record per user per year
leaveBalanceSchema.index({ user: 1, year: 1 }, { unique: true });

// Virtual to calculate remaining balance
leaveBalanceSchema.pre('save', function() {
  Object.keys(this.balances).forEach(category => {
    this.balances[category].remaining = this.balances[category].allocated - this.balances[category].used;
  });
});

export default mongoose.model("LeaveBalance", leaveBalanceSchema);
