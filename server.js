// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// ── Imports des routes et middlewares ──────────────────────────────
const assignmentsRoutes = require('./routes/assignments');
const authRoutes = require('./routes/auth');         // NOUVEAU
const { verifyToken, isAdmin } = require('./middleware/auth'); // NOUVEAU


const app = express();

app.use(cors());
// ── Connexion MongoDB ──────────────────────────────────────────────
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI manquant dans .env');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => console.log('✅ MongoDB connecté'));

// ── Middlewares globaux ────────────────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Authorization ajouté !
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ── Routes publiques (pas besoin d'être connecté) ──────────────────
//app.get('/api/assignments', assignmentsRoutes.getAssignments);
app.get('/api/assignments', verifyToken, assignmentsRoutes.getAssignmentsPagine);
app.get('/api/assignments/:id', verifyToken, assignmentsRoutes.getAssignment);
app.post('/api/assignments', verifyToken, assignmentsRoutes.postAssignment);

// Routes d'authentification — toujours publiques
app.post('/api/auth/register', authRoutes.register);
app.post('/api/auth/login', authRoutes.login);
app.post('/api/auth/logout', authRoutes.logout);

// ── Route pour récupérer la liste des matières
const { MATIERES } = require('./model/assignment');
app.get('/api/matieres', (req, res) => {
  res.json(MATIERES);
});


// Route pour vérifier son token (utile côté Angular au démarrage)
app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// SIMPLE PAGE HOME (served by backend) — Le front peut afficher sa propre page, mais
// ce endpoint permet d'avoir une page disponible immédiatement après login
app.get('/home', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Assignments Manager - Home</title>
      <style>
        body { background:#0f1724; color:#fff; font-family: Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0 }
        .card { text-align:center; max-width:900px; padding:40px; border-radius:12px; background:linear-gradient(135deg,#0b1220 0%, #1b2533 100%); box-shadow:0 8px 30px rgba(2,6,23,0.6)}
        h1 { font-size:48px; margin:0 0 12px }
        p { font-size:20px; opacity:0.85 }
        .actions { margin-top:24px }
        a.btn { display:inline-block; margin:0 12px; padding:12px 20px; border-radius:999px; text-decoration:none; color:#fff; background:#6b5eea }
        a.btn.secondary { background:#2b3948 }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Assignments Manager</h1>
        <p>Gérez et suivez facilement les devoirs de vos étudiants. Ajoutez des devoirs, consultez la liste, et suivez les notes.</p>
        <div class="actions">
          <a class="btn" href="/add">Ajouter un assignment</a>
          <a class="btn secondary" href="/assignments">Voir tous les assignments</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// ── Routes protégées (nécessitent d'être admin) ────────────────────

app.put('/api/assignments', verifyToken, isAdmin, assignmentsRoutes.updateAssignment);
app.delete('/api/assignments/:id', verifyToken, isAdmin, assignmentsRoutes.deleteAssignment);

// Route pour récupérer les matières (peut être publique ou protégée selon votre choix)
app.get('/api/matieres', assignmentsRoutes.getMatieres);

// ── Démarrage du serveur ───────────────────────────────────────────
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));

//router.get('/matieres', getMatieres);