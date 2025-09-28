import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role:  { type: String, required: true, enum: ["intern", "junior", "senior", "manager", "director", "hr"] },
    team:  { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    maritalStatus: { type: String, enum: ["single", "married", "divorced", "widowed"], required: true },
    level: { type: String, required: true, trim: true } // For leave policy mapping
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
