import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pharmacieRoutes from "./routes/pharmacie.routes.js";

const app = express();

const PORT = 3000;

// Chemin du fichier app.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware JSON
app.use(express.json());

// Servir le frontend situé à la racine du projet
app.use(express.static(path.join(__dirname, "../public")));

// Route API
app.get("/api", (req, res) => {
    res.json({
        message: "API PharmaGuard opérationnelle"
    });
});

// Routes pharmacies
app.use("/api/pharmacies", pharmacieRoutes);

// 404 pour les routes API inexistantes
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "Route API introuvable"
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});