import express from "express";
import cors from "cors";

import pharmacieRoutes from "./routes/pharmacie.routes.js";

const app = express();

const PORT = process.env.PORT


app.use(cors())


app.use(express.json());


app.get("/api", (req, res) => {
    res.json({
        message: "API PharmaGuard opérationnelle"
    });
});

app.use("/api/pharmacies", pharmacieRoutes);


app.use("/api", (req, res) => {
    res.status(404).json({
        message: "Route API introuvable"
    });
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});