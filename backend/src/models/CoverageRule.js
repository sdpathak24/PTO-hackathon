import mongoose from "mongoose";

// Example doc: { team: "Core", minOnDuty: { engineer: 2, designer: 1 } }
const coverageRuleSchema = new mongoose.Schema(
  {
    team: { type: String, required: true, unique: true },
    minOnDuty: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("CoverageRule", coverageRuleSchema);
