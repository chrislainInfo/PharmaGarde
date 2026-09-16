import express from "express";
import pharmacieRoutes from "./routes/pharmacie.routes.js";
import cors from 'cors';


const app = express();

const PORT = 3000

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "API PharmaGarde opérationnelle"
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