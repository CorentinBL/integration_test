# 📋 Formulaire d'inscription React

Application React permettant à un utilisateur de s'enregistrer via un formulaire, avec validation, persistance locale et déploiement automatisé.

---

## 🔗 Liens

| Ressource | Lien |
|---|---|
| 📁 Repository GitHub | https://github.com/CorentinBL/integration_test |
| 🌐 Application déployée (GitHub Pages) | https://corentinbl.github.io/integration_test/ |
| 📦 Package npm | https://www.npmjs.com/package/integration-test-react-corentin-2026 |
| 📊 Rapport de couverture (Codecov) | https://app.codecov.io/gh/CorentinBL/integration_test |

---

## ✨ Fonctionnalités

- Formulaire d'inscription avec les champs : **prénom, nom, email, date de naissance, ville, code postal**
- Bouton **Sauvegarder** désactivé tant que tous les champs ne sont pas remplis
- **Validation** de chaque champ avec message d'erreur en rouge sous le champ concerné
- En cas de succès : sauvegarde dans le **localStorage**, affichage d'un **toaster de succès** et réinitialisation des champs
- En cas d'échec : affichage d'un **toaster d'erreur** et des messages d'erreur correspondants

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

## 🗂️ Structure du projet

```
src/
├── App.js                        # Composant racine
├── App.test.js                   # Tests du composant racine
├── App.css                       # Styles globaux
├── components/
│   ├── FieldForm.jsx             # Champ de formulaire réutilisable
│   ├── FieldForm.test.jsx        # Tests du composant FieldForm
│   ├── RegistrationForm.jsx      # Formulaire complet d'inscription
│   ├── RegistrationForm.test.jsx # Tests du composant RegistrationForm
│   ├── Toast.jsx                 # Notification de succès / erreur
│   └── Toast.test.jsx            # Tests du composant Toast
├── hooks/
│   ├── useRegistrationForm.js    # Hook : état, validation, soumission
│   └── useRegistrationForm.test.js # Tests du hook
└── utils/
    ├── validators.js             # Fonctions de validation pures
    ├── validators.test.js        # Tests des validateurs
    ├── localStorage.js           # Service de persistance
    └── localStorage.test.js     # Tests du service localStorage

```

---

## 🧪 Tests

### Couverture

| Fichier | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| All files | **100%** | **100%** | **100%** | **100%** |

> `index.js` et `reportWebVitals.js` exclus de la couverture.

### Cas testés

- ✅ Calcul de l'âge à partir d'une date de naissance
- ✅ Vérification que l'âge est supérieur ou égal à 18 ans
- ✅ Validation du format du code postal français
- ✅ Validation du format du prénom / nom / ville (cas normaux et cas particuliers : accents, tiret, apostrophe, chiffres, caractères spéciaux…)
- ✅ Validation du format de l'email
- ✅ Désactivation du bouton si les champs ne sont pas tous remplis
- ✅ Sauvegarde dans le localStorage et affichage du toaster de succès avec réinitialisation des champs
- ✅ Affichage du toaster d'erreur et des messages d'erreur en rouge

### Lancer les tests

```bash
# Lancer les tests en mode watch
npm test

# Lancer les tests avec rapport de couverture
npm test -- --coverage --watchAll=false
```

---

## ⚙️ Installation et démarrage

### Prérequis

- Node.js >= 16
- npm >= 8

### Installation

```bash
git clone https://github.com/CorentinBL/integration_test.git
cd my-app
npm install
```

### Démarrage

```bash
npm start
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### Build de production

```bash
npm run build
```

---

## 🚀 CI/CD — GitHub Actions

Le workflow se déclenche à chaque push sur `master` et effectue les étapes suivantes dans l'ordre :

```
JSDoc ──► Build ──► Tests UT & IT ──► Codecov ──► Déploiement npm ──► Déploiement GitHub Pages
```

> Le déploiement n'est **jamais effectué si les tests échouent**.

### Versioning

Le versioning est géré **manuellement** via le champ `version` dans `package.json`.  
La publication sur npm se déclenche automatiquement si la version locale est différente de la version publiée sur le registry npm.

| Action | Résultat |
|---|---|
| Modifier `version` en `1.0.1` (patch) | Nouvelle version publiée sur npm |
| Modifier `version` en `1.1.0` (minor) | Nouvelle version publiée sur npm |
| Modifier `version` en `2.0.0` (major) | Nouvelle version publiée sur npm |

---

## 📐 Principes SOLID appliqués

| Principe | Application |
|---|---|
| **S** – Single Responsibility | Chaque fichier a une responsabilité unique : `validators.js` valide, `localStorage.js` persiste, `useRegistrationForm.js` orchestre l'état |
| **O** – Open/Closed | `FieldForm` est extensible via ses props sans modification du composant |
| **L** – Liskov | Les composants respectent leurs contrats de props |
| **I** – Interface Segregation | Les props de chaque composant sont minimales et ciblées |
| **D** – Dependency Inversion | Le hook dépend des abstractions (`validateForm`, `saveRegistration`) et non des implémentations directes |

---

## 🛠️ Technologies

- [React](https://reactjs.org/) 18
- [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/)
- [GitHub Actions](https://github.com/features/actions)
- [GitHub Pages](https://pages.github.com/)
- [Codecov](https://codecov.io/)