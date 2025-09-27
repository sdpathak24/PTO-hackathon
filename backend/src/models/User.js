import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role:  { type: String, required: true, enum: ["engineer", "designer", "manager", "qa", "support"] },
    team:  { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
