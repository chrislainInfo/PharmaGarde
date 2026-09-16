import {
    getPharmacies,
    getPharmacieById
} from "../repositories/pharmacie.repository.js";

async function index(req, res) {
    try {
        const {
            quartier,
            arrondissement,
            deGarde
        } = req.query;

        const pharmacies = await getPharmacies({
            quartier,
            arrondissement,
            deGarde
        });

        res.json({
            data: pharmacies
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la récupération des pharmacies"
        });
    }
}

async function show(req, res) {
    try {
        const { id } = req.params;

        const pharmacie = await getPharmacieById(id);

        if (!pharmacie) {
            return res.status(404).json({
                message: "Pharmacie introuvable"
            });
        }

        res.json({
            data: pharmacie
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la récupération de la pharmacie"
        });
    }
}

export {
    index,
    show
};