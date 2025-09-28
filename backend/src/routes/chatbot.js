import express from "express";
import { getChatbotResponse } from "../services/chatbotService.js";

const router = express.Router();

// Chat with AI assistant
router.post("/chat", async (req, res) => {
  try {
    const { message, userEmail } = req.body;
    
    if (!message || !userEmail) {
      return res.status(400).json({ error: "Message and user email are required" });
    }

    const response = await getChatbotResponse(message, userEmail);
    res.json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
