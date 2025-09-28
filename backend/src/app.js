import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";

// ✅ import your routes
import userRoutes from "./routes/users.js";
import ptoRoutes from "./routes/pto.js";
import coverageRoutes from "./routes/coverage.js";
import hrRoutes from "./routes/hr.js";
import chatbotRoutes from "./routes/chatbot.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("🚀 SmartPTO backend is running!");
});

// ✅ mount routes
app.use("/api/users", userRoutes);
app.use("/api/pto", ptoRoutes);
app.use("/api/coverage", coverageRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/chatbot", chatbotRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
});
