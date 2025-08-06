// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Custom modules (must be converted to ESM or wrapped if still using CJS)
import connect_mongoDB from "./config/db.js";
import cropCalendarRoutes from "./routes/cropCalendar.js";
import agricultureRoutes from "./routes/agricultureRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import healthcareRoutes from "./routes/healthcareRoutes.js";

// ENV setup
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connect_mongoDB();

// Root test
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Chat route using Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const { input, currentGoal } = req.body;

    const systemInstruction = `
You are a smart assistant designed to help people in rural areas with their goals related to:

1. **Agriculture** – crop selection, calendars, soil prep, irrigation, weather advice, pest control, organic farming, farming technologies, etc.
2. **Education** – study plans, basic concepts (Math, Science, etc.), learning strategies, problem-solving, educational tools, and subjects like trigonometry, algebra, history, language, etc.
3. **Healthcare** – vaccination schedules, maternal/child health, first aid, wellness tips, general health advice, fitness, nutrition, and lifestyle improvements.

✅ For valid goals/questions related to Agriculture, Education, or Healthcare: provide easy-to-follow answers with clear, structured formatting. Use numbered lists, bold important terms, and ensure the output is organized.
✅ For Agriculture: cover related topics like farming techniques, pest management, weather impacts, and more.
✅ For Education: respond to questions about learning strategies, subjects like Math, Science, languages, etc., with clear explanations and examples. Use bold for important concepts.
✅ For Healthcare: respond to general health advice, fitness tips, and common wellness issues, but never provide a diagnosis. Always suggest consulting with a local health professional if needed.
✅ For new goals: give a step-by-step numbered plan (maximum 5 steps), ensuring each step is clear and bolded for emphasis.
✅ For follow-ups: answer in context of the goal, with a maximum of 200 -250 words. Avoid repetition and truncation.
❌ For non-supported questions: reply with "I can only help with farming, education, or healthcare. Please ask something in those areas."

Always use simple, respectful, and beginner-friendly language.
Never provide a diagnosis. Suggest visiting a local health worker if needed.
Be consistent in your responses and avoid major differences in the answers for similar prompts.

Limit the response to 202 words or less. If the answer requires more information, suggest breaking it into smaller steps.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: input }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 202
      },
      systemInstruction
    });

    const text = result.response.text();
    res.json({ response: text });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    res.status(500).json({ response: "Something went wrong with Gemini API." });
  }
});

// API routes
app.use("/api/agriculture", agricultureRoutes);
app.use("/api/agriculture/crop-calendar", cropCalendarRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/healthcare", healthcareRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
