# Tâches pour l'équipe

Ce fichier liste toutes les tâches à réaliser. Chaque tâche a un nom de branche à utiliser, une description et des indices pour t'aider.

**Règles :**
- Prends une seule tâche à la fois
- Crée la branche avant d'écrire la moindre ligne de code (voir GIT_GUIDE.md)
- Demande à Samir si tu es bloqué depuis plus de 30 minutes

---

## Comment prendre en charge une tâche

1. Lis la tâche attentivement
2. Crée ta branche : `git checkout -b feature/nom-de-la-tache`
3. Travaille dessus
4. Push et ouvre une Pull Request quand c'est terminé

---

## Les tâches

---

### TACHE-01 — Installer nodemon pour le développement

**Branche :** `chore/setup-nodemon`
**Difficulté :** Débutant
**Temps estimé :** 15 minutes

**Quoi faire :**
- Installer `nodemon` comme dépendance de développement
- Mettre à jour le script `dev` dans `package.json` pour que `npm run dev` redémarre le serveur automatiquement à chaque modification de fichier

**Commande :**
```bash
npm install --save-dev nodemon
```

Puis dans `package.json` :
```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

**Comment tester :** Lance `npm run dev`, modifie n'importe quel fichier et vérifie que le serveur redémarre automatiquement.

---

### TACHE-02 — Ajouter la validation des données pour la création de produit

**Branche :** `feature/validation-produit`
**Difficulté :** Débutant
**Temps estimé :** 30 minutes

**Quoi faire :**
- Dans `src/controllers/productController.js`, ajouter une validation dans la fonction `create`
- Si `name` est absent → retourner `400` avec le message `"Le nom est obligatoire"`
- Si `price` est absent ou n'est pas un nombre → retourner `400` avec `"Le prix doit être un nombre valide"`
- Si `price` est négatif → retourner `400` avec `"Le prix doit être supérieur à 0"`

**Indice :** Fais ça en haut de la fonction `create`, avant d'appeler `Product.create()` :
```js
if (!name) return res.status(400).json({ message: 'Le nom est obligatoire' });
```

**Comment tester :** Utilise Postman ou Thunder Client. Envoie un POST sur `/api/products` avec un body vide — tu dois recevoir une erreur 400.

---

### TACHE-03 — Ajouter un middleware global de gestion des erreurs

**Branche :** `feature/middleware-erreurs`
**Difficulté :** Intermédiaire
**Temps estimé :** 45 minutes

**Quoi faire :**
- Créer un nouveau fichier : `src/middlewares/errorHandler.js`
- Écrire un middleware Express qui attrape toutes les erreurs non gérées et retourne une réponse JSON propre
- L'ajouter dans `app.js` après toutes les routes

**À quoi ressemble le middleware :**
```js
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur',
  });
};

module.exports = errorHandler;
```

**Dans app.js, ajouter après les routes :**
```js
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);
```

**Ensuite mettre à jour les controllers :** envelopper les fonctions async et appeler `next(err)` dans le catch.

**Comment tester :** Provoque une erreur volontairement (mets un mauvais nom de base de données dans `.env`) — tu dois recevoir une réponse JSON propre au lieu d'un crash.

---

### TACHE-04 — Ajouter l'endpoint d'inscription utilisateur

**Branche :** `feature/inscription-utilisateur`
**Difficulté :** Intermédiaire
**Temps estimé :** 1 heure

**Quoi faire :**
- Installer `bcrypt` : `npm install bcrypt`
- Créer `src/controllers/authController.js`
- Créer `src/routes/authRoutes.js`
- Ajouter un endpoint `POST /api/auth/register`

**La fonction register doit :**
1. Récupérer `name`, `email`, `password` depuis `req.body`
2. Vérifier si un utilisateur avec cet email existe déjà
3. Hasher le mot de passe avec bcrypt : `bcrypt.hash(password, 10)`
4. Créer l'utilisateur en base de données
5. Retourner l'utilisateur (sans le champ password)

**Indice — cacher le mot de passe dans la réponse :**
```js
const user = await User.create({ name, email, password: hashed });
const { password: _, ...safeUser } = user.toJSON();
res.status(201).json(safeUser);
```

**Comment tester :** POST sur `/api/auth/register` avec `{ "name": "Ali", "email": "ali@test.com", "password": "123456" }`. Vérifie dans MySQL que le mot de passe est bien hashé.

---

### TACHE-05 — Ajouter l'endpoint de connexion utilisateur

**Branche :** `feature/connexion-utilisateur`
**Difficulté :** Intermédiaire
**Temps estimé :** 1 heure

**Dépend de :** La TACHE-04 doit être mergée d'abord

**Quoi faire :**
- Installer `jsonwebtoken` : `npm install jsonwebtoken`
- Ajouter `JWT_SECRET=ta_cle_secrete_aleatoire` dans `.env` et `.env.example`
- Ajouter un endpoint `POST /api/auth/login` dans `authController.js`

**La fonction login doit :**
1. Récupérer `email`, `password` depuis `req.body`
2. Trouver l'utilisateur par email — s'il n'existe pas, retourner `404`
3. Comparer le mot de passe avec bcrypt : `bcrypt.compare(password, user.password)`
4. Si le mot de passe est incorrect → retourner `401`
5. Si correct → créer un token JWT et le retourner

**Indice — créer un token :**
```js
const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token });
```

**Comment tester :** POST sur `/api/auth/login` avec les bons identifiants → tu reçois un token. Avec un mauvais mot de passe → tu reçois 401.

---

### TACHE-06 — Ajouter un middleware d'authentification pour protéger les routes

**Branche :** `feature/middleware-auth`
**Difficulté :** Intermédiaire
**Temps estimé :** 45 minutes

**Dépend de :** La TACHE-05 doit être mergée d'abord

**Quoi faire :**
- Créer `src/middlewares/authMiddleware.js`
- Le middleware lit le JWT depuis le header `Authorization`
- Si valide → attache l'utilisateur à `req.user` et appelle `next()`
- Si absent ou invalide → retourner `401`

**Indice :**
```js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Aucun token fourni' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = protect;
```

**Applique-le aux routes du panier** (un utilisateur doit être connecté pour accéder au panier) :
```js
const protect = require('../middlewares/authMiddleware');
router.get('/:userId', protect, getCart);
```

**Comment tester :** Appelle `/api/cart/1` sans token → reçois 401. Appelle avec un token valide dans le header → reçois les données du panier.

---

### TACHE-07 — Ajouter la recherche et le filtre de produits

**Branche :** `feature/recherche-produit`
**Difficulté :** Intermédiaire
**Temps estimé :** 1 heure

**Quoi faire :**
- Mettre à jour la fonction `getAll` dans `productController.js`
- Supporter ces paramètres de requête :
  - `?search=telephone` → filtrer par nom contenant "telephone"
  - `?minPrice=10&maxPrice=100` → filtrer par fourchette de prix
  - `?page=1&limit=10` → paginer les résultats

**Indice — clause where avec Sequelize :**
```js
const { Op } = require('sequelize');

const where = {};
if (req.query.search) {
  where.name = { [Op.like]: `%${req.query.search}%` };
}
if (req.query.minPrice) {
  where.price = { ...where.price, [Op.gte]: req.query.minPrice };
}
```

**Comment tester :**
- `GET /api/products?search=chemise`
- `GET /api/products?minPrice=10&maxPrice=50`
- `GET /api/products?page=1&limit=5`

---

### TACHE-08 — Créer une collection Postman

**Branche :** `docs/collection-postman`
**Difficulté :** Débutant
**Temps estimé :** 30 minutes

**Quoi faire :**
- Ouvre Postman (ou Thunder Client dans VSCode)
- Crée une collection appelée `E-Commerce API`
- Ajoute une requête pour **chaque endpoint** de l'API (voir README.md pour la liste complète)
- Exporte la collection en `postman_collection.json` et ajoute-la à la racine du projet
- Ajoute une note dans `README.md` expliquant comment l'importer

**Pourquoi c'est utile :** N'importe qui qui rejoint l'équipe peut immédiatement tester tous les endpoints sans les configurer manuellement.

---

## Tableau de suivi des tâches

| Tâche | Statut | Qui |
|-------|--------|-----|
| TACHE-01 — nodemon | Ouvert | — |
| TACHE-02 — Validation produit | Ouvert | — |
| TACHE-03 — Middleware erreurs | Ouvert | — |
| TACHE-04 — Inscription utilisateur | Ouvert | — |
| TACHE-05 — Connexion utilisateur | Ouvert | — |
| TACHE-06 — Middleware auth | Ouvert | — |
| TACHE-07 — Recherche produit | Ouvert | — |
| TACHE-08 — Collection Postman | Ouvert | — |

Mets à jour ce tableau quand tu commences ou termines une tâche. Change le statut en `En cours` ou `Terminé` et mets ton prénom.
