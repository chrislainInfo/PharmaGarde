import express from "express";
import pharmacieRoutes from "./routes/pharmacie.routes.js";

const app = express();

const PORT = 3000

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "API PharmaGuard opérationnelle"
    });
});


app.use("/api/pharmacies", pharmacieRoutes);


app.use((req, res) => {
    res.status(404).json({
        message: "Route introuvable"
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});