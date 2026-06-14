import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.get("/api/ping", (req, res) => {
  res.json({ status: "ok", message: "Backend API is running." });
});

app.post("/api/predict", (req, res) => {
  const { sepalLength, sepalWidth, petalLength, petalWidth } = req.body;

  const inputs = [sepalLength, sepalWidth, petalLength, petalWidth];
  if (inputs.some((value) => typeof value !== "number" || Number.isNaN(value))) {
    return res.status(400).json({ error: "Request body must include numeric sepalLength, sepalWidth, petalLength, and petalWidth." });
  }

  const species = predictIrisSpecies({ sepalLength, sepalWidth, petalLength, petalWidth });
  const confidence = computeConfidence(species, { sepalLength, sepalWidth, petalLength, petalWidth });

  return res.json({ species, confidence, source: "backend" });
});

app.post("/api/gemini", async (req, res) => {
  const prompt = typeof req.body.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt) {
    return res.status(400).json({ error: "Request body must include a non-empty 'prompt' string." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY in environment." });
  }

  try {
    const response = await fetch("https://gemini.googleapis.com/v1/models/text-bison-001:generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: {
          text: prompt,
        },
        temperature: 0.2,
        maxOutputTokens: 256,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      return res.status(response.status).json({ error: message });
    }

    const data = await response.json();
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

function predictIrisSpecies({ sepalLength, sepalWidth, petalLength, petalWidth }) {
  if (petalLength < 2.5) {
    return "Iris-setosa";
  }

  if (petalLength < 4.8 || petalWidth < 1.8) {
    return "Iris-versicolor";
  }

  return "Iris-virginica";
}

function computeConfidence(species, features) {
  if (species === "Iris-setosa") {
    return 0.95;
  }
  if (species === "Iris-versicolor") {
    return 0.78;
  }
  return 0.86;
}

async function startServer() {
  const vite = await createViteServer({ server: { middlewareMode: "ssr" } });
  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`Dev server running: http://localhost:${PORT}`);
    console.log(`Backend API available at http://localhost:${PORT}/api/ping`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
