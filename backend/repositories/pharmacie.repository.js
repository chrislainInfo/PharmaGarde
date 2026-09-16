import { readFile } from "node:fs/promises";

const DATA_FILE = new URL("../data/pharmacies.json", import.meta.url);

async function getPharmacies(filters = {}) {
    const data = await readFile(DATA_FILE, "utf-8");

    let pharmacies = JSON.parse(data);

    const {
        quartier,
        arrondissement,
        deGarde
    } = filters;

    // Filtre par quartier
    if (quartier) {
        pharmacies = pharmacies.filter(
            (pharmacie) =>
                pharmacie.quartier.toLowerCase() === quartier.toLowerCase()
        );
    }

    // Filtre par arrondissement
    if (arrondissement) {
        pharmacies = pharmacies.filter(
            (pharmacie) =>
                pharmacie.arrondissement.toLowerCase() ===
                arrondissement.toLowerCase()
        );
    }

    // Filtre par pharmacie de garde
    if (deGarde !== undefined) {
        const garde = deGarde.toLowerCase() === "true";

        pharmacies = pharmacies.filter(
            (pharmacie) => pharmacie.deGarde === garde
        );
    }

    return pharmacies;
}

async function getPharmacieById(id) {
    const pharmacies = await getPharmacies();

    return pharmacies.find(
        (pharmacie) => pharmacie.id === Number(id)
    );
}

export {
    getPharmacies,
    getPharmacieById
};