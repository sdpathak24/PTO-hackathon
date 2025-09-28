import mongoose from "mongoose";

const leavePolicySchema = new mongoose.Schema(
  {
    role: { 
      type: String, 
      required: true, 
      enum: ["intern", "junior", "senior", "manager", "director"] 
    },
    leaveCategories: {
      personal: { type: Number, default: 0 },
      sick: { type: Number, default: 0 },
      bereavement: { type: Number, default: 0 },
      maternity: { type: Number, default: 0 },
      paternity: { type: Number, default: 0 }
    },
    isActive: { type: Boolean, default: true },
    year: { type: Number, required: true, default: () => new Date().getFullYear() }
  },
  { timestamps: true }
);

// Ensure one policy per role per year
leavePolicySchema.index({ role: 1, year: 1 }, { unique: true });

export default mongoose.model("LeavePolicy", leavePolicySchema);
