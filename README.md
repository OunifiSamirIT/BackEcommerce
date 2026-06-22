# Backend E-Commerce — Présentation du projet

Bienvenue dans l'équipe ! Ce document explique le projet, la structure des dossiers et comment tout fonctionne ensemble. Lis ceci en premier avant de toucher au code.

---

## C'est quoi ce projet ?

C'est une **API REST** construite avec **Node.js + Express.js** connectée à une base de données **MySQL** via **Sequelize** (un ORM — Object Relational Mapper). C'est le backend d'une application e-commerce simple. Le frontend (site web ou app mobile) appellera cette API pour envoyer et recevoir des données.

Il n'y a pas de HTML ici. Tout communique en **JSON**.

---

## Technologies utilisées

| Outil | Rôle |
|-------|------|
| Node.js | Environnement d'exécution JavaScript (fait tourner JS hors du navigateur) |
| Express.js | Framework web — gère les routes et les requêtes HTTP |
| Sequelize | ORM — permet d'écrire du JS plutôt que du SQL brut |
| MySQL | Base de données relationnelle |
| dotenv | Charge la configuration secrète depuis un fichier `.env` |

---

## Structure du projet

```
backecommerce/
├── src/
│   ├── config/
│   │   └── database.js       ← Connexion à MySQL avec les infos du .env
│   │
│   ├── models/               ← Chaque fichier = une table en base de données
│   │   ├── User.js           ← Table users (nom, email, mot de passe, rôle)
│   │   ├── Product.js        ← Table products (nom, prix, stock, image...)
│   │   └── Cart.js           ← Table carts (quel utilisateur a ajouté quel produit)
│   │
│   ├── controllers/          ← La logique : ce qui se passe quand une route est appelée
│   │   ├── productController.js
│   │   └── cartController.js
│   │
│   ├── routes/               ← Les URLs (endpoints) de l'API
│   │   ├── productRoutes.js
│   │   └── cartRoutes.js
│   │
│   └── app.js                ← Point d'entrée — démarre le serveur
│
├── .env                      ← Ta configuration secrète (ne jamais commit ce fichier !)
├── .env.example              ← Modèle du .env (celui-ci peut être commité)
├── .gitignore                ← Fichiers que Git doit ignorer
└── package.json              ← Dépendances et scripts du projet
```

---

## Comment une requête traverse l'application

Quand quelqu'un appelle `GET /api/products`, voici ce qui se passe étape par étape :

```
Requête (HTTP)
    ↓
app.js              — reçoit la requête, la passe au bon router
    ↓
productRoutes.js    — fait correspondre l'URL et la méthode HTTP (GET, POST, PUT, DELETE)
    ↓
productController.js — exécute la logique (interroge la base, retourne le résultat)
    ↓
Product.js (model)  — Sequelize parle à MySQL
    ↓
Réponse (JSON)      — envoyée au client
```

---

## Les endpoints de l'API

### Produits

| Méthode | URL | Ce que ça fait |
|---------|-----|----------------|
| GET | `/api/products` | Récupérer tous les produits |
| GET | `/api/products/:id` | Récupérer un produit par son ID |
| POST | `/api/products` | Créer un nouveau produit |
| PUT | `/api/products/:id` | Modifier un produit |
| DELETE | `/api/products/:id` | Supprimer un produit |

### Panier (Cart)

| Méthode | URL | Ce que ça fait |
|---------|-----|----------------|
| GET | `/api/cart/:userId` | Récupérer le panier d'un utilisateur |
| POST | `/api/cart` | Ajouter un produit au panier |
| PUT | `/api/cart/:id` | Modifier la quantité d'un article |
| DELETE | `/api/cart/:id` | Supprimer un article du panier |

---

## Comment lancer le projet en local

### 1. Cloner le repo et installer les dépendances

```bash
git clone <url-du-repo>
cd backecommerce
npm install
```

### 2. Créer ton fichier `.env`

Copie le fichier exemple et remplis tes informations MySQL :

```bash
cp .env.example .env
```

Puis ouvre `.env` et configure :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe_mysql
DB_NAME=ecommerce
```

### 3. Créer la base de données MySQL

Ouvre MySQL et exécute :

```sql
CREATE DATABASE ecommerce;
```

### 4. Démarrer le serveur

```bash
npm start
```

Sequelize va **créer automatiquement les tables** au premier démarrage. Tu verras :

```
Database connected and tables synced
Server running on port 3000
```

### 5. Tester un endpoint

Ouvre ton navigateur ou utilise Postman / Thunder Client :

```
GET http://localhost:3000/api/products
```

---

## Les modèles expliqués

### User (Utilisateur)
| Champ | Type | Notes |
|-------|------|-------|
| id | INT | Généré automatiquement |
| name | STRING | Obligatoire |
| email | STRING | Obligatoire, unique |
| password | STRING | Sera hashé plus tard |
| role | ENUM | 'admin' ou 'customer' |

### Product (Produit)
| Champ | Type | Notes |
|-------|------|-------|
| id | INT | Généré automatiquement |
| name | STRING | Obligatoire |
| description | TEXT | Optionnel |
| price | DECIMAL | Obligatoire |
| stock | INT | 0 par défaut |
| image | STRING | URL ou nom de fichier |

### Cart (Panier)
| Champ | Type | Notes |
|-------|------|-------|
| id | INT | Généré automatiquement |
| userId | INT | Clé étrangère → User |
| productId | INT | Clé étrangère → Product |
| quantity | INT | Nombre d'articles |

---

## Ce qui n'est pas encore fait (tes tâches sont dans TASKS.md)

- Inscription et connexion utilisateur (auth)
- Hashage du mot de passe
- Tokens JWT pour protéger les routes
- Validation des données en entrée
- Middleware de gestion des erreurs

---

## Des questions ?

Demande à Samir. Il a construit la base. Ton travail est de construire dessus.
