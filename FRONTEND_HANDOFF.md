Backend changes effectués (résumé pour le développeur front-end)

Contexte
- Repo: backend Express/Mongo (angular_back).
- Auth: JWT (login renvoie `token`), le frontend gère le stockage du token (localStorage ou cookie).

Ce que j'ai modifié côté backend

1) Validation de la note
- Fichier modifié: model/assignment.js
- Règle: `note` est maintenant un Number avec `min: 0` et `max: 20`.
- Routes affectées: routes/assignments.js
  - POST `/api/assignments`: si la valeur `note` envoyée est > 20, API renvoie HTTP 400 avec `{ message: 'La note ne peut pas dépasser 20' }`.
  - PUT `/api/assignments`: même validation si `note` est fournie.

2) Endpoint logout
- Fichier modifié: routes/auth.js et server.js
- Nouveau endpoint: `POST /api/auth/logout`
- Comportement: renvoie `{ message: 'Logged out' }` (HTTP 200).
- Remarque: avec JWT stocké côté client, il faut que le front efface le token local (localStorage/sessionStorage) et redirige vers la page de login.

3) Page /home simple fournie par le backend
- Ajouté `GET /home` dans server.js qui renvoie une page HTML minimale contenant:
  - Un titre et un texte explicatif.
  - Deux boutons (liens) : `/add` (vers le formulaire d'ajout) et `/assignments` (vers la liste des assignments).
- Remarque: cette page est une page de secours fournie par le backend. Le front Angular peut remplacer entièrement cette page en créant sa propre route `/home` et en y mettant le design souhaité (voir plus bas).

Ce que le front doit faire (tâches pour le développeur front-end)

- Redirection après login:
  - Après réception du token côté front, stocker le token et rediriger l'utilisateur vers la route front `/home` (ou `http://<backend>/home` si vous voulez utiliser la page servie par le backend). Exemple: `this.router.navigate(['/home'])`.

- Implémenter la page `Home` front (recommandé):
  - Créer une route et un composant `HomeComponent` qui reproduit le visuel souhaité.
  - Le composant doit afficher un texte descriptif (logo/titre), et deux boutons :
    - "Ajouter" : route vers la page de formulaire d'ajout (`/add` ou `/ajouter` selon votre routing actuel).
    - "Voir tous les assignments" : route vers la page de liste (`/assignments` ou `/home/assignments`).
  - Si vous préférez utiliser la page backend fournie, vous pouvez rediriger vers `/home` (GET) mais cela contournera le routage Angular.

- Logout (obligatoire pour l'UX demandée):
  - Lors du clic sur le bouton Logout côté front, appeler `POST /api/auth/logout` puis :
    1. Supprimer le token (ex: `localStorage.removeItem('token')`).
    2. Rediriger vers la page de login (ex: `this.router.navigate(['/login'])`).
  - Exemple minimal (Angular) :

  ```ts
  logout() {
    this.http.post('/api/auth/logout', {}).subscribe(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, () => {
      // même comportement en cas d'erreur réseau
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
  ```

- Validation côté front pour la note (UX):
  - Dans le formulaire d'ajout/édition, limiter le champ `note` à 0-20 dans le contrôle (attribut `max="20"` et validation FormControl).
  - Malgré cette validation côté front, le backend applique déjà la règle et renverra 400 si > 20.

- Auth headers (déjà requis):
  - Pour toutes les routes protégées (ex: `GET /api/assignments`), inclure l'entête `Authorization: Bearer <token>`.

Points d'intégration / exemples d'URLs
- POST /api/auth/login  -> login
- POST /api/auth/logout -> logout (backend)
- POST /api/assignments -> créer assignment (vérification note<=20 côté backend)
- PUT /api/assignments   -> mettre à jour (vérif note aussi)
- GET /home -> page HTML minimale fournie par backend (option de fallback)

Si tu veux, je peux :
- Modifier les URLs dans la page HTML `/home` pour pointer précisément vers vos routes front Angular (ex: `/home` ou `/assignments?page=1`).
- Ajouter une réponse plus riche côté `POST /api/auth/logout` (ex: redirection HTTP) si tu utilises des cookies côté client.

---
Fichier modifiés (backend):
- /model/assignment.js
- /routes/assignments.js
- /routes/auth.js
- /server.js

Demandes suivantes ? (ex: je peux adapter la page /home pour renvoyer JSON au lieu de HTML si le front préfère)
