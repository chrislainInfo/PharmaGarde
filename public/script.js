const API_BASE_URL = "http://localhost:3000/api/pharmacies";

const grid = document.getElementById("pharmacies-grid");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const emptyEl = document.getElementById("empty");
const resultsCount = document.getElementById("results-count");

const quartierSelect = document.getElementById("filter-quartier");
const arrondissementSelect = document.getElementById("filter-arrondissement");
const gardeCheckbox = document.getElementById("filter-garde");
const resetBtn = document.getElementById("reset-filters");

let allPharmacies = [];

// Remplit dynamiquement les listes de quartiers/arrondissements
function populateFilters(pharmacies) {
    const quartiers = [...new Set(pharmacies.map(p => p.quartier))].sort();
    const arrondissements = [...new Set(pharmacies.map(p => p.arrondissement))].sort();

    quartiers.forEach(q => {
        const option = document.createElement("option");
        option.value = q;
        option.textContent = q;
        quartierSelect.appendChild(option);
    });

    arrondissements.forEach(a => {
        const option = document.createElement("option");
        option.value = a;
        option.textContent = a;
        arrondissementSelect.appendChild(option);
    });
}

function buildQueryParams() {
    const params = new URLSearchParams();

    if (quartierSelect.value) params.set("quartier", quartierSelect.value);
    if (arrondissementSelect.value) params.set("arrondissement", arrondissementSelect.value);
    if (gardeCheckbox.checked) params.set("deGarde", "true");

    return params.toString();
}

function renderPharmacies(pharmacies) {
    grid.innerHTML = "";

    if (pharmacies.length === 0) {
        emptyEl.classList.remove("hidden");
        resultsCount.textContent = "";
        return;
    }

    emptyEl.classList.add("hidden");
    resultsCount.textContent = `${pharmacies.length} résultat${pharmacies.length > 1 ? "s" : ""}`;

    pharmacies.forEach(pharmacie => {
        const card = document.createElement("div");
        card.className = "pharmacy-card";

        card.innerHTML = `
            <div class="card-top">
                <h3>${pharmacie.nom}</h3>
                <span class="badge ${pharmacie.deGarde ? "badge-garde" : "badge-ferme"}">
                    ${pharmacie.deGarde ? "De garde" : "Fermée"}
                </span>
            </div>
            <p><span class="icon">📍</span> ${pharmacie.adresse}, ${pharmacie.quartier}</p>
            <p><span class="icon">📞</span> ${pharmacie.telephone}</p>
            <div class="card-footer">
                <span class="horaires">${pharmacie.horaires.ouverture} - ${pharmacie.horaires.fermeture}</span>
                <button class="btn-call" onclick="window.location.href='tel:${pharmacie.telephone}'">Appeler</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

async function loadPharmacies(withFilters = false) {
    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
    emptyEl.classList.add("hidden");
    grid.innerHTML = "";

    try {
        const query = withFilters ? buildQueryParams() : "";
        const url = query ? `${API_BASE_URL}?${query}` : API_BASE_URL;

        const response = await fetch(url);

        if (!response.ok) throw new Error("Erreur réseau");

        const { data } = await response.json();

        if (!withFilters) {
            allPharmacies = data;
            populateFilters(data);
        }

        loadingEl.classList.add("hidden");
        renderPharmacies(data);
    } catch (err) {
        console.error(err);
        loadingEl.classList.add("hidden");
        errorEl.classList.remove("hidden");
    }
}

function applyFilters() {
    loadPharmacies(true);
}

quartierSelect.addEventListener("change", applyFilters);
arrondissementSelect.addEventListener("change", applyFilters);
gardeCheckbox.addEventListener("change", applyFilters);

resetBtn.addEventListener("click", () => {
    quartierSelect.value = "";
    arrondissementSelect.value = "";
    gardeCheckbox.checked = false;
    loadPharmacies(false);
});

loadPharmacies(false);