# 📋 Formulaire d'inscription React

Application React permettant à un utilisateur de s'enregistrer via un formulaire, avec validation, persistance en base de données MySQL et déploiement automatisé.

---

## 🔗 Liens

| Ressource | Lien                                                               |
|---|--------------------------------------------------------------------|
| 📁 Repository GitHub | https://github.com/CorentinBL/integration_test                     |
| 🌐 Frontend déployé (GitHub Pages) | https://corentinbl.github.io/integration_test/                     |
| 🔧 Backend déployé (Vercel) | https://ton-projet.vercel.app                                      |
| 🐳 Image Docker Frontend (Docker Hub) | https://hub.docker.com/r/corentinbla/frontend                      |
| 🐳 Image Docker Backend (Docker Hub) | https://hub.docker.com/r/corentinbla/backend                       |
| 📦 Package npm | https://www.npmjs.com/package/integration-test-react-corentin-2026 |
| 📊 Rapport de couverture (Codecov) | https://app.codecov.io/gh/CorentinBL/integration_test              |

---

## ✨ Fonctionnalités

- Formulaire d'inscription avec les champs : **prénom, nom, email, date de naissance, ville, code postal**
- Bouton **Sauvegarder** désactivé tant que tous les champs ne sont pas remplis
- **Validation** de chaque champ avec message d'erreur en rouge sous le champ concerné
- En cas de succès : sauvegarde en **base de données MySQL**, affichage d'un **toaster de succès** et réinitialisation des champs
- En cas d'échec : affichage d'un message d'erreur
- **Liste des inscrits** affichée en temps réel
- **Espace admin** : connexion sécurisée, accès aux détails des utilisateurs et suppression

---

## ✅ Règles de validation

| Champ | Règle |
|---|---|
| Prénom / Nom | Lettres uniquement (accents, tréma, cédille, tiret, apostrophe autorisés) — chiffres et caractères spéciaux refusés |
| Email | Format standard `utilisateur@domaine.extension` |
| Date de naissance | L'utilisateur doit avoir **18 ans ou plus** |
| Code postal | Format français : **5 chiffres** exactement |
| Ville | Même règle que prénom / nom |

---

## 🏗️ Architecture Docker

```
docker-compose.yml
├── db        → MySQL 8 (base de données)
├── adminer   → Interface web MySQL (port 8080)
├── server    → API FastAPI Python (port 8000)
└── react     → Application React (port 3000)
```


# Démarrer tous les services
docker compose up --build

# Arrêter les services
docker compose down -v
```

| Service | URL |
|---|---|
| Frontend React | http://localhost:3000 |
| API FastAPI | http://localhost:8000 |
| Adminer | http://localhost:8080 |

---

## 🗂️ Structure du projet

```
├── my-app/                        # Frontend React
│   └── src/
│       ├── components/            # Composants React
│       ├── hooks/                 # Hooks personnalisés
│       └── utils/                 # Fonctions utilitaires + API
├── server/                        # Backend Python
│   ├── server.py                  # API FastAPI
│   ├── test_server.py             # Tests d'intégration Python
│   ├── requirements.txt           # Dépendances Python
│   ├── vercel.json                # Configuration Vercel
│   └── DockerfilePython           # Dockerfile backend
├── sqlfiles/                      # Scripts SQL d'initialisation
├── DockerfileReact                # Dockerfile frontend
├── docker-compose.yml             # Orchestration des services
└── .env                        # Variables d'environnement 
```

---

## 🧪 Tests

### Tests unitaires React

```bash
npm test
npm test -- --coverage --watchAll=false
```

| Fichier | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| All files | **100%** | **100%** | **100%** | **100%** |

### Cas testés (React)

- ✅ Calcul de l'âge à partir d'une date de naissance
- ✅ Vérification que l'âge est supérieur ou égal à 18 ans
- ✅ Validation du format du code postal français
- ✅ Validation du format du prénom / nom / ville
- ✅ Validation du format de l'email
- ✅ Désactivation du bouton si les champs ne sont pas tous remplis
- ✅ Sauvegarde en base de données et affichage du toaster de succès
- ✅ Affichage du toaster d'erreur et des messages d'erreur

### Tests d'intégration Python (FastAPI)

```bash
cd server
pip install fastapi uvicorn mysql-connector-python pytest httpx
pytest test_server.py -v
```

| Endpoint | Cas testés |
|---|---|
| `GET /` | Retourne Hello World |
| `GET /users` | Liste vide, liste avec users, erreur DB |
| `POST /users` | Création réussie, erreur DB, champs manquants (422) |
| `POST /admin/login` | Succès + token, identifiants invalides (401), erreur DB |
| `DELETE /users/:id` | Suppression, 404, 401 sans token, erreur DB |
| `GET /users/:id` | Détails, 404, 401 sans token, erreur DB |

### Tests e2e Cypress

```bash
npm run cypress
```

| Feature | Cas testés |
|---|---|
| Connexion admin | Succès, champs vides, identifiants invalides |
| Liste des inscrits | Affichage, liste vide, boutons admin cachés/visibles |
| Formulaire d'inscription | Validation email, code postal, âge, succès, erreur 500 |
| Détails utilisateur | Affichage modale, fermeture |
| Suppression utilisateur | Suppression réussie, boutons absents sans token |
| Réseau | Serveur indisponible |

---

## 🚀 CI/CD — GitHub Actions

Le workflow se déclenche à chaque push sur `master` :

```
Tests UT React
      │
Tests IT Python
      │
Docker Compose up
      │
Tests d'infrastructure ──► Tests e2e Cypress
      │
Docker Compose down
      │
Codecov ──► Build ──► NPM publish
      │
      ├──► GitHub Pages (frontend)
      ├──► Vercel (backend)
      └──► Docker Hub (images)
```

> Le déploiement n'est **jamais effectué si les tests échouent**.

### Tests d'infrastructure

La pipeline vérifie automatiquement :
- ✅ API répond sur le port 8000
- ✅ Adminer répond sur le port 8080
- ✅ `GET /users` retourne 200
- ✅ Login admin retourne un token valide

### Secrets GitHub requis

| Secret | Description |
|---|---|
| `MYSQL_ROOT_PASSWORD` | Mot de passe MySQL |
| `MYSQL_DATABASE` | Nom de la base de données |
| `MYSQL_USER` | Utilisateur MySQL |
| `MYSQL_ADMIN_EMAIL` | Email de l'admin |
| `MYSQL_ADMIN_PASSWORD` | Mot de passe de l'admin |
| `MYSQL_PORT` | Port MySQL |
| `VERCEL_TOKEN` | Token Vercel |
| `VERCEL_ORG_ID` | Organisation Vercel |
| `VERCEL_PROJECT_ID` | Projet Vercel |
| `DOCKERHUB_USERNAME` | Nom d'utilisateur Docker Hub |
| `DOCKERHUB_TOKEN` | Token Docker Hub |
| `CODECOV_TOKEN` | Token Codecov |
| `NPM_TOKEN` | Token npm |
| `REACT_APP_SERVER_URL` | URL du backend en prod |

---

## 📐 Principes SOLID appliqués

| Principe | Application |
|---|---|
| **S** – Single Responsibility | Chaque fichier a une responsabilité unique : `validators.js` valide, `api.js` gère les appels HTTP, `useRegistrationForm.js` orchestre l'état |
| **O** – Open/Closed | `FieldForm` est extensible via ses props sans modification du composant |
| **L** – Liskov | Les composants respectent leurs contrats de props |
| **I** – Interface Segregation | Les props de chaque composant sont minimales et ciblées |
| **D** – Dependency Inversion | Le hook dépend des abstractions (`validateForm`, `createUser`) et non des implémentations directes |

---

## 🛠️ Technologies

- [React](https://reactjs.org/) 18
- [FastAPI](https://fastapi.tiangolo.com/) — API REST Python
- [MySQL](https://www.mysql.com/) — Base de données
- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)
- [Pytest](https://pytest.org/) — Tests Python
- [Cypress](https://www.cypress.io/) — Tests e2e
- [GitHub Actions](https://github.com/features/actions)
- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/) — Déploiement backend
- [Aiven](https://aiven.io/) — MySQL en production
- [Codecov](https://codecov.io/)