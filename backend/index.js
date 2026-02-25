require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

// Serve the Front-end folder as static files
app.use(express.static(path.join(__dirname, "../Front-end")));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/chat", async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages are required and must be an array" });
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
        });
        res.json(response.choices[0].message);
    } catch (error) {
        console.error("Groq API Error:", error.message);
        res.status(500).json({ error: "Failed to get response from AI", details: error.message });
    }
});

// Catch-all: serve index.html for any unknown route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Front-end/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("===========================================");
    console.log("  Server is running!");
    console.log("  Open this in Chrome: http://localhost:" + PORT);
    console.log("===========================================");
});
