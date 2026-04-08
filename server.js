import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Riddle 1-card API is running.");
});

app.post("/api/riddle-single-interpretation", async (req, res) => {
  try {
    const { positions } = req.body;

    if (!Array.isArray(positions) || positions.length !== 1) {
      return res.status(400).json({
        error: "Le backend attend exactement 1 position."
      });
    }

    const card = positions[0];

    const prompt = `
Tu es l'interprète officiel de Riddle Arcana.

Règles :
- Tu n'es pas un voyant.
- Tu ne prédis pas l'avenir.
- Tu proposes une lecture symbolique et introspective.
- Ton ton est profond, clair, sobre et élégant.
- Tu t'adresses directement à la personne en disant "tu".
- N'utilise aucun markdown.
- Pas de ###.
- Pas de **.
- Écris en texte brut uniquement.
- Longueur : entre 90 et 140 mots.
- Une seule carte, une seule lecture cohérente.
- Termine par une phrase d'ouverture intérieure.

Carte tirée :
${card.position} : ${card.name}
`;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: prompt
    });

    return res.json({
      interpretation: response.output_text
    });
  } catch (error) {
    console.error("Erreur single interpretation:", error);
    return res.status(500).json({
      error: "Erreur lors de la génération de l'interprétation."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});

