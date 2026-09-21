const API_BASE_URL = "https://pharmagarde-8gfu.onrender.com/api/pharmacies";

// =====================================================
// ELEMENTS DOM
// =====================================================

const grid = document.getElementById("pharmacies-grid");

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const emptyEl = document.getElementById("empty");

const resultsCount = document.getElementById("results-count");

const quartierSelect =
    document.getElementById("filter-quartier");

const arrondissementSelect =
    document.getElementById("filter-arrondissement");

const gardeCheckbox =
    document.getElementById("filter-garde");

const resetBtn =
    document.getElementById("reset-filters");

const searchInput =
    document.getElementById("search-pharmacie");

const retryButton =
    document.getElementById("retry-button");

// Statistiques

const totalPharmaciesEl =
    document.getElementById("total-pharmacies");

const totalGardeEl =
    document.getElementById("total-garde");

const totalZonesEl =
    document.getElementById("total-zones");

// Menu

const menuToggle =
    document.getElementById("menu-toggle");

const mainNav =
    document.querySelector(".main-nav");

// Modal

const hoursModal =
    document.getElementById("hours-modal");

const modalOverlay =
    document.getElementById("modal-overlay");

const modalClose =
    document.getElementById("modal-close");

const modalPharmacyName =
    document.getElementById("modal-pharmacy-name");

const modalPharmacyAddress =
    document.getElementById("modal-pharmacy-address");

const modalOpening =
    document.getElementById("modal-opening");

const modalClosing =
    document.getElementById("modal-closing");

const modalStatus =
    document.getElementById("modal-status");

// =====================================================
// VARIABLES
// =====================================================

let allPharmacies = [];

let currentPharmacies = [];

// =====================================================
// IMAGES
// =====================================================

const pharmacyImages = {
    1: "images/image1.jpg",
    2: "images/image2.jpg",
    3: "images/image3.jpg",
    4: "images/image4.jpg",
    5: "images/image5.jpg",
    6: "images/image6.jpg"
};

// =====================================================
// UTILITAIRES
// =====================================================

function formatTime(time) {

    if (!time) {
        return "--";
    }

    const [hours, minutes] = time.split(":");

    if (minutes === "00") {
        return `${hours}h`;
    }

    return `${hours}h${minutes}`;
}

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getPharmacyImage(pharmacie) {

    if (pharmacie.image) {
        return pharmacie.image;
    }

    return pharmacyImages[((pharmacie.id - 1) % 6) + 1]
        || "https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?auto=format&fit=crop&w=900&q=85";
}

// =====================================================
// CONSTRUCTION DE L'URL
// =====================================================

function buildQueryParams() {

    const params = new URLSearchParams();

    if (quartierSelect.value) {
        params.set(
            "quartier",
            quartierSelect.value
        );
    }

    if (arrondissementSelect.value) {
        params.set(
            "arrondissement",
            arrondissementSelect.value
        );
    }

    if (gardeCheckbox.checked) {
        params.set(
            "deGarde",
            "true"
        );
    }

    return params.toString();
}

// =====================================================
// CHARGEMENT DES FILTRES
// =====================================================

function populateFilters(pharmacies) {

    const quartiers = [
        ...new Set(
            pharmacies
                .map(pharmacie => pharmacie.quartier)
                .filter(Boolean)
        )
    ].sort();

    const arrondissements = [
        ...new Set(
            pharmacies
                .map(pharmacie => pharmacie.arrondissement)
                .filter(Boolean)
        )
    ].sort();

    // On vide les anciennes options
    // sauf la première.

    quartierSelect.innerHTML = `
        <option value="">
            Tous les quartiers
        </option>
    `;

    arrondissementSelect.innerHTML = `
        <option value="">
            Tous les arrondissements
        </option>
    `;

    quartiers.forEach(quartier => {

        const option =
            document.createElement("option");

        option.value = quartier;
        option.textContent = quartier;

        quartierSelect.appendChild(option);
    });

    arrondissements.forEach(arrondissement => {

        const option =
            document.createElement("option");

        option.value = arrondissement;
        option.textContent = arrondissement;

        arrondissementSelect.appendChild(option);
    });
}

// =====================================================
// STATISTIQUES
// =====================================================

function updateStatistics(pharmacies) {

    const total =
        pharmacies.length;

    const totalGarde =
        pharmacies.filter(
            pharmacie => pharmacie.deGarde
        ).length;

    const zones =
        new Set(
            pharmacies
                .map(pharmacie => pharmacie.arrondissement)
                .filter(Boolean)
        ).size;

    totalPharmaciesEl.textContent = total;

    totalGardeEl.textContent = totalGarde;

    totalZonesEl.textContent = zones;
}

// =====================================================
// RECHERCHE LOCALE
// =====================================================

function applySearch(pharmacies) {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    if (!search) {
        return pharmacies;
    }

    return pharmacies.filter(pharmacie => {

        const text = [
            pharmacie.nom,
            pharmacie.adresse,
            pharmacie.quartier,
            pharmacie.arrondissement,
            pharmacie.telephone
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return text.includes(search);
    });
}

// =====================================================
// AFFICHAGE DES PHARMACIES
// =====================================================

function renderPharmacies(pharmacies) {

    grid.innerHTML = "";

    currentPharmacies = pharmacies;

    if (pharmacies.length === 0) {

        emptyEl.classList.remove("hidden");

        resultsCount.textContent = "";

        return;
    }

    emptyEl.classList.add("hidden");

    resultsCount.textContent =
        `${pharmacies.length} pharmacie${pharmacies.length > 1 ? "s" : ""}`;

    pharmacies.forEach(pharmacie => {

        const card =
            document.createElement("article");

        card.className = "pharmacy-card";

        const image =
            getPharmacyImage(pharmacie);

        const isGarde =
            pharmacie.deGarde === true;

        const statusText =
            isGarde
                ? "De garde"
                : "Fermée";

        const statusClass =
            isGarde
                ? ""
                : "closed";

        card.innerHTML = `

            <div class="card-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(pharmacie.nom)}"
                    loading="lazy"
                >

                <div class="image-overlay"></div>

                <span class="card-badge ${statusClass}">

                    <span class="card-badge-dot"></span>

                    ${statusText}

                </span>

            </div>

            <div class="card-body">

                <div class="card-top">

                    <h3>
                        ${escapeHTML(pharmacie.nom)}
                    </h3>

                </div>

                <div class="card-location">

                    <span aria-hidden="true">
                        ⌖
                    </span>

                    <span>
                        ${escapeHTML(pharmacie.adresse)},
                        ${escapeHTML(pharmacie.quartier)}
                    </span>

                </div>

                <div class="card-phone">

                    <span aria-hidden="true">
                        ☎
                    </span>

                    <span>
                        ${escapeHTML(pharmacie.telephone)}
                    </span>

                </div>

                <div class="card-actions">

                    <button
                        type="button"
                        class="card-button hours-button"
                        data-hours-id="${pharmacie.id}"
                    >
                        ◷
                        Horaires
                    </button>

                    <a
                        href="https://www.google.com/maps/search/?api=1&query=${pharmacie.latitude},${pharmacie.longitude}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="card-button map-button"
                    >
                        ⌖
                        Voir la localisation
                    </a>

                </div>

            </div>
        `;

        grid.appendChild(card);
    });

    // Boutons horaires

    document
        .querySelectorAll("[data-hours-id]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.hoursId
                        );

                    const pharmacie =
                        allPharmacies.find(
                            item => item.id === id
                        );

                    if (pharmacie) {
                        openHoursModal(pharmacie);
                    }
                }
            );
        });
}

// =====================================================
// MODALE HORAIRES
// =====================================================

function openHoursModal(pharmacie) {

    modalPharmacyName.textContent =
        pharmacie.nom;

    modalPharmacyAddress.textContent =
        `${pharmacie.adresse}, ${pharmacie.quartier}`;

    modalOpening.textContent =
        formatTime(
            pharmacie.horaires?.ouverture
        );

    modalClosing.textContent =
        formatTime(
            pharmacie.horaires?.fermeture
        );

    if (pharmacie.deGarde) {

        modalStatus.textContent =
            "✓ Cette pharmacie est de garde";

        modalStatus.style.background =
            "#eaf6ef";

        modalStatus.style.color =
            "#176340";

    } else {

        modalStatus.textContent =
            "Pharmacie non indiquée comme étant de garde";

        modalStatus.style.background =
            "#f1f3f2";

        modalStatus.style.color =
            "#65766e";
    }

    hoursModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    modalClose.focus();
}

function closeHoursModal() {

    hoursModal.classList.add("hidden");

    document.body.style.overflow = "";
}

modalClose.addEventListener(
    "click",
    closeHoursModal
);

modalOverlay.addEventListener(
    "click",
    closeHoursModal
);

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !hoursModal.classList.contains("hidden")
        ) {
            closeHoursModal();
        }
    }
);

// =====================================================
// CHARGEMENT DES PHARMACIES
// =====================================================

async function loadPharmacies(
    withFilters = false
) {

    loadingEl.classList.remove("hidden");

    errorEl.classList.add("hidden");

    emptyEl.classList.add("hidden");

    grid.innerHTML = "";

    try {

        const query =
            withFilters
                ? buildQueryParams()
                : "";

        const url =
            query
                ? `${API_BASE_URL}?${query}`
                : API_BASE_URL;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                `Erreur HTTP ${response.status}`
            );
        }

        const result =
            await response.json();

        const pharmacies =
            result.data || [];

        if (!withFilters) {

            allPharmacies = pharmacies;

            populateFilters(
                pharmacies
            );

            updateStatistics(
                pharmacies
            );
        }

        loadingEl.classList.add("hidden");

        const searchedPharmacies =
            applySearch(pharmacies);

        renderPharmacies(
            searchedPharmacies
        );

    } catch (error) {

        console.error(
            "Erreur PharmaGuard :",
            error
        );

        loadingEl.classList.add("hidden");

        errorEl.classList.remove("hidden");
    }
}

// =====================================================
// FILTRES
// =====================================================

function applyFilters() {

    loadPharmacies(true);
}

quartierSelect.addEventListener(
    "change",
    applyFilters
);

arrondissementSelect.addEventListener(
    "change",
    applyFilters
);

gardeCheckbox.addEventListener(
    "change",
    applyFilters
);

// =====================================================
// RECHERCHE
// =====================================================

searchInput.addEventListener(
    "input",
    () => {

        const filtered =
            applySearch(
                currentPharmacies.length
                    ? currentPharmacies
                    : allPharmacies
            );

        renderPharmacies(filtered);
    }
);

// =====================================================
// RESET
// =====================================================

resetBtn.addEventListener(
    "click",
    () => {

        quartierSelect.value = "";

        arrondissementSelect.value = "";

        gardeCheckbox.checked = false;

        searchInput.value = "";

        loadPharmacies(false);
    }
);

// =====================================================
// RETRY
// =====================================================

retryButton.addEventListener(
    "click",
    () => {

        loadPharmacies(false);
    }
);

// =====================================================
// MENU MOBILE
// =====================================================

menuToggle.addEventListener(
    "click",
    () => {

        const isOpen =
            mainNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    }
);

// Fermer le menu après clic

document
    .querySelectorAll(".main-nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mainNav.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        );
    });

// =====================================================
// LANCEMENT
// =====================================================

loadPharmacies(false);