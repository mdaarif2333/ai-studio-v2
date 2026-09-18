import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

app.post("/api/chat", async (req, res) => {
  try {
    if (!genAI) return res.json({ reply: "Bhai, Render me GEMINI_API_KEY add karna bhool gaye!" });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(req.body.prompt);
    res.json({ reply: result.response.text() });
  } catch (e) { 
    res.json({ reply: "Error: " + e.message }) 
  }
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Live on " + PORT));
