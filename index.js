import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Inisialisasi middleware untuk parsing JSON
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Inisialisasi GoogleGenAI API
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY, // Ganti dengan API Key kamu
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

// Route untuk menangani permintaan dari klien
app.post("/api/generate", async (req, res) => {
  const { message, aiName } = req.body; // Menambahkan parameter aiName

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Set default name jika tidak diberikan
  const aiNameToUse = aiName || "Kumar"; // Jika tidak ada nama, default ke 'Kumar'

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        thinkingConfig: {
          thinkingBudget: 100, // Pastikan thinking aktif
        },
      },
    });

    // Kirimkan hasil response dari API ke klien
    return res.json({ text: response.text });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error processing request" });
  }
});

if (process.env.NODE_ENV === "development") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

export default serverless(app);
