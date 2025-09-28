import mongoose from "mongoose";

const ptoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },  // snapshot role at request time
    team: { type: String, required: true },  // snapshot team
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: "" },
    leaveType: { 
      type: String, 
      required: true, 
      enum: ["personal", "sick", "bereavement", "maternity", "paternity"] 
    },
    status: { type: String, enum: ["pending", "approved", "denied"], default: "pending" },
    aiRecommendation: { type: String, default: "" },
    daysRequested: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("PTORequest", ptoSchema);
