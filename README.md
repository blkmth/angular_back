# Assignments API

> Petite API pour gérer des devoirs (assignments) avec authentification.

Description
-
Ce projet fournit une API backend en Node.js/Express et MongoDB pour créer, lire, mettre à jour et supprimer des devoirs. L'API inclut aussi un système d'authentification (inscription / connexion) basé sur des tokens JWT.

Ce que le développeur a réalisé
-
- Mise en place d'un serveur Express (`server.js`) qui se connecte à MongoDB.
- Modèles Mongoose pour les `Assignment` et les `User` (stockage des devoirs et des utilisateurs).
- Routes pour gérer les devoirs : récupération (avec pagination et recherche), création, modification et suppression.
- Système d'authentification : `register` et `login` qui renvoient un token JWT.
- Middleware d'autorisation : vérification du token (`verifyToken`) et restriction aux administrateurs (`isAdmin`).
- Liste de matières (`MATIERES`) et intégration d'images depuis le dossier `assets/`.

Installation (rapide)
-
1. Copier le projet sur votre machine.
2. Créer un fichier `.env` à la racine et y définir au minimum :

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=une_cle_secrete
PORT=8010 (optionnel)
```

3. Installer les dépendances :

```
npm install
```

4. Lancer le serveur :

```
npm start
```

Endpoints principaux (explication simple)
-
- `POST /api/auth/register` : créer un compte utilisateur.
- `POST /api/auth/login` : se connecter et recevoir un token.
- `GET /api/auth/me` : vérifier son token et obtenir les infos utilisateur.
- `GET /api/assignments` : liste paginée des devoirs (nécessite token).
- `GET /api/assignments/:id` : obtenir un devoir précis (nécessite token).
- `POST /api/assignments` : créer un devoir (nécessite token).
- `PUT /api/assignments` : modifier un devoir (nécessite token + rôle admin).
- `DELETE /api/assignments/:id` : supprimer un devoir (nécessite token + rôle admin).
- `GET /api/matieres` : récupérer la liste des matières disponibles.

Notes pratiques
-
- Les images et icônes des matières sont attendues dans le dossier `assets/`.
- Le projet utilise `dotenv` pour charger les variables d'environnement ; assurez-vous que `MONGODB_URI` et `JWT_SECRET` sont définis.
- Les mots de passe sont hashés avant stockage (sécurité basique assurée).

Améliorations possibles
-
- Ajouter une documentation interactive (Postman collection ou Swagger) pour tester plus facilement.
- Ajouter des tests automatisés.
- Gérer le téléchargement d'images avec `multer` (si besoin d'ajouter/mettre à jour des images via l'API).

Où regarder dans le code
-
- Le serveur principal : [server.js](server.js)
- Les routes des devoirs : [routes/assignments.js](routes/assignments.js)
- L'authentification : [routes/auth.js](routes/auth.js)
- Le modèle Assignment : [model/assignment.js](model/assignment.js)
- Le modèle User : [model/user.js](model/user.js)
- Le middleware d'authentification : [middleware/auth.js](middleware/auth.js)

role et compte 
admin 
 login :  admin 
 password : 1234

user 
 login :user 
 password : 1234

Comptes de test (création automatique)
-
Un petit script permet de créer rapidement deux comptes de test (admin et user) dans la base MongoDB.

Commandes :

```bash
# après avoir rempli .env (MONGODB_URI et JWT_SECRET)
node scripts/seedUsers.js
```

Identifiants créés par le script :
- admin / 1234 (rôle `admin`)
- user  / 1234 (rôle `user`)

