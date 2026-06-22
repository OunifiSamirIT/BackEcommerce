# Guide Git — Comment travailler en équipe

Ce guide explique comment utiliser Git quand tu travailles avec un autre développeur. Suis ces règles tous les jours. Elles protègent ton travail et évitent les conflits.

---

## Avant de commencer — les règles d'or

1. **Ne travaille jamais directement sur `main`** — crée toujours une branche
2. **Fais un pull avant de push** — récupère toujours le code le plus récent d'abord
3. **Commite souvent, avec des messages clairs** — une tâche = un commit
4. **Ne commite jamais `.env`** — il contient des secrets. Il est déjà dans `.gitignore`
5. **Lis ce que tu commites** — utilise `git diff` avant `git add`

---

## Configuration initiale (à faire une seule fois)

```bash
# Dire à Git qui tu es
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"

# Cloner le projet
git clone <url-du-repo>
cd backecommerce

# Installer les dépendances
npm install

# Copier le fichier env et le remplir
cp .env.example .env
```

---

## Routine quotidienne (à faire chaque jour)

### Étape 1 — Récupérer le code le plus récent avant de commencer

```bash
git checkout main
git pull origin main
```

> Fais toujours ça en début de journée. Sinon tu travailles sur du vieux code.

---

### Étape 2 — Créer une branche pour ta tâche

```bash
git checkout -b feature/nom-de-ta-tache
```

**Convention de nommage des branches :**

| Préfixe | Quand l'utiliser | Exemple |
|---------|-----------------|---------|
| `feature/` | Ajouter une nouvelle fonctionnalité | `feature/user-login` |
| `fix/` | Corriger un bug | `fix/bug-quantite-panier` |
| `refactor/` | Nettoyer du code | `refactor/product-controller` |
| `docs/` | Documentation uniquement | `docs/mise-a-jour-readme` |

---

### Étape 3 — Travailler sur ta tâche, puis commiter

```bash
# Voir quels fichiers tu as modifiés
git status

# Voir les modifications ligne par ligne
git diff

# Ajouter les fichiers que tu veux commiter (sois précis, pas git add .)
git add src/controllers/productController.js
git add src/routes/productRoutes.js

# Commiter avec un message clair
git commit -m "feat: ajouter la pagination à la liste des produits"
```

**Format des messages de commit :**

```
type: courte description de ce que tu as fait
```

| Type | Quand l'utiliser |
|------|-----------------|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `refactor:` | Nettoyage de code |
| `docs:` | Documentation |
| `chore:` | Configuration, dépendances |

Bons exemples :
```
feat: ajouter l'endpoint d'inscription utilisateur
fix: retourner 404 quand le produit n'existe pas
docs: mettre à jour le README avec les étapes d'installation
chore: installer la dépendance bcrypt
```

Mauvais exemples :
```
update
fix bug
changements
wip
```

---

### Étape 4 — Pousser ta branche

```bash
git push origin feature/nom-de-ta-tache
```

---

### Étape 5 — Ouvrir une Pull Request (PR)

Va sur GitHub → ouvre une Pull Request depuis ta branche vers `main`.

- Écris ce que tu as fait
- Demande à Samir de la relire
- Ne merge PAS ta propre PR sans relecture

---

### Étape 6 — Après que ta PR est mergée, nettoie

```bash
git checkout main
git pull origin main
git branch -d feature/nom-de-ta-tache
```

---

## Situations courantes et quoi faire

### "J'ai besoin des derniers changements de main dans ma branche"

```bash
git checkout main
git pull origin main
git checkout feature/nom-de-ta-tache
git merge main
```

Résous les éventuels conflits, puis continue à travailler.

---

### "J'ai un conflit de fusion (merge conflict)"

Un conflit ressemble à ça dans le fichier :

```
<<<<<<< HEAD
ton code
=======
leur code
>>>>>>> main
```

**Que faire :**
1. Ouvre le fichier dans ton éditeur
2. Décide quelle version est correcte (ou combine les deux)
3. Supprime les lignes `<<<<<<<`, `=======`, `>>>>>>>`
4. Sauvegarde le fichier
5. Puis :

```bash
git add le-fichier.js
git commit -m "fix: résoudre le conflit dans le controller produit"
```

---

### "J'ai modifié le mauvais fichier par accident"

```bash
# Annuler les changements d'un fichier spécifique (avant de l'avoir stagé)
git checkout -- src/models/User.js

# Annuler tous les changements non stagés
git checkout .
```

---

### "J'ai stagé le mauvais fichier"

```bash
# Déstaguer un fichier (garde tes changements, juste enlève-le du staging)
git reset HEAD src/models/User.js
```

---

### "Je veux voir l'historique"

```bash
# Log complet
git log

# Log propre en une ligne
git log --oneline

# Voir qui a changé quelle ligne dans un fichier
git blame src/controllers/productController.js
```

---

### "Je veux voir ce qui a changé entre ma branche et main"

```bash
git diff main..feature/nom-de-ta-tache
```

---

## Antisèche des commandes

| Commande | Ce qu'elle fait |
|----------|----------------|
| `git status` | Voir les fichiers modifiés |
| `git diff` | Voir les modifications ligne par ligne |
| `git add <fichier>` | Stager un fichier |
| `git commit -m "msg"` | Sauvegarder un commit en local |
| `git push origin <branche>` | Pousser vers le remote |
| `git pull origin main` | Récupérer le dernier code de main |
| `git checkout -b <branche>` | Créer et basculer vers une branche |
| `git checkout <branche>` | Changer de branche |
| `git merge main` | Fusionner main dans la branche courante |
| `git log --oneline` | Historique court des commits |
| `git stash` | Mettre temporairement de côté tes changements |
| `git stash pop` | Récupérer les changements mis de côté |

---

## Ce qu'il ne faut JAMAIS faire

```bash
# Ne JAMAIS forcer un push sur main
git push --force origin main

# Ne JAMAIS commiter .env
git add .env

# Ne JAMAIS commiter node_modules
git add node_modules/

# Ne JAMAIS travailler directement sur main sans branche
# (bascule d'abord sur une branche)
```

---

## Comment la collaboration en équipe se passe

```
branche main  ────────────────────────────────────────────────►
                    │                        │
                    │ Samir ouvre une PR     │ Toi tu ouvres une PR
                    ▼                        ▼
            feature/auth-jwt        feature/recherche-produit
                    │                        │
                    └──────── Relecture PR ──┘
                                    │
                              merge dans main
```

Vous travaillez chacun sur des branches séparées, vous relisez le code de l'autre, puis vous mergez dans main.
