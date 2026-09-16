# 🟢 PharmaGuard

Site vitrine et API pour la recherche de pharmacies de garde à Brazzaville. PharmaGuard permet aux utilisateurs de localiser rapidement les pharmacies ouvertes dans leur quartier, avec un filtrage par quartier, arrondissement et statut "de garde".

## ✨ Fonctionnalités

- 🔍 Liste des pharmacies avec leurs informations (nom, adresse, téléphone, horaires)
- 🗺️ Filtrage par quartier et par arrondissement
- 🚨 Filtrage des pharmacies de garde uniquement
- 📱 Interface responsive (mobile first)
- ☎️ Appel direct depuis la fiche pharmacie

## 🛠️ Technologies

**Backend**
- Node.js
- Express.js
- Stockage des données en JSON (`data/pharmacies.json`)

**Frontend**
- HTML5 / CSS3 (mobile first)
- JavaScript vanilla (Fetch API)

## 📁 Structure du projet

```
pharmaguard/
├── controllers/
│   └── pharmacie.controller.js
├── routes/
│   └── pharmacie.routes.js
├── repositories/
│   └── pharmacie.repository.js
├── data/
│   └── pharmacies.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── app.js
├── package.json
└── README.md
```

## 🚀 Installation

1. Cloner le projet

```
git clone <url-du-repo>
cd pharmaguard
```

2. Installer les dépendances

```
npm install
```

3. Lancer le serveur

```
node app.js
```

ou avec nodemon en développement :

```
npx nodemon app.js
```

4. Ouvrir le site dans le navigateur

```
http://localhost:3000
```

## 📡 API — Endpoints

### `GET /api/pharmacies`

Retourne la liste des pharmacies. Supporte les filtres suivants en query params :

| Paramètre        | Type    | Description                                          |
|-------------------|---------|-------------------------------------------------------|
| `quartier`        | string  | Filtre par nom de quartier                            |
| `arrondissement`  | string  | Filtre par arrondissement                             |
| `deGarde`         | boolean | `true` pour ne retourner que les pharmacies de garde  |

**Exemple :**

```
GET /api/pharmacies?quartier=Moungali&deGarde=true
```

**Réponse :**

```
{
  "data": [
    {
      "id": 1,
      "nom": "Pharmacie La Grâce",
      "adresse": "Avenue de la Paix",
      "quartier": "Moungali",
      "arrondissement": "Moungali",
      "telephone": "+242 06 000 00 01",
      "latitude": -4.2634,
      "longitude": 15.2832,
      "deGarde": true,
      "horaires": {
        "ouverture": "08:00",
        "fermeture": "22:00"
      }
    }
  ]
}
```

### `GET /api/pharmacies/:id`

Retourne une pharmacie par son identifiant.

**Réponse si trouvée :** `200 OK` avec l'objet pharmacie.
**Réponse si introuvable :** `404 Not Found`

```
{ "message": "Pharmacie introuvable" }
```

## 🖥️ Frontend

Le dossier `public/` contient le site vitrine, servi automatiquement par Express via `express.static("public")`. Il consomme l'API `/api/pharmacies` en JavaScript vanilla, avec :
- des filtres dynamiques générés à partir des données reçues,
- un rendu en cartes responsive (mobile first),
- un état de chargement, d'erreur et de résultat vide.

## 📌 À venir

- [ ] Géolocalisation de l'utilisateur
- [ ] Carte interactive
- [ ] Base de données persistante (remplacement du JSON)

## 👤 Auteur

Projet développé dans le cadre d'un projet personnel / académique.
