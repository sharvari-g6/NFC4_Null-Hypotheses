// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const { input, currentGoal } = req.body;

  const systemInstruction = `
You are a smart assistant designed to help people in rural areas with their goals related to:

1. Agriculture – crop selection, calendars, soil prep, irrigation.
2. Education – study plans, basic concepts (Math, Science, etc.).
3. Healthcare – vaccination schedules, maternal/child health, first aid.

✅ For valid goals/questions: reply with easy-to-follow answers.
✅ For new goals: give a step-by-step numbered plan.
✅ For follow-ups: answer in context of the goal.
❌ For non-supported questions: reply with "I can only help with farming, education, or healthcare. Please ask something in those areas."

Always use simple, respectful, and beginner-friendly language.
Never provide a diagnosis. Suggest visiting a local health worker if needed.
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: input }]  // ✅ FIXED: wrap in { text: ... }
        }
      ],
      generationConfig: {
        temperature: 0.7
      },
      systemInstruction
    });

    const text = result.response.text();
    res.json({ response: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: "Something went wrong with Gemini API." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));