// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// ── Imports des routes et middlewares ──────────────────────────────
const assignmentsRoutes = require('./routes/assignments');
const authRoutes = require('./routes/auth');         // NOUVEAU
const { verifyToken, isAdmin } = require('./middleware/auth'); // NOUVEAU

const app = express();

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
app.get('/api/assignments', assignmentsRoutes.getAssignments);
app.get('/api/assignments/:id', assignmentsRoutes.getAssignment);
app.post('/api/assignments', verifyToken, assignmentsRoutes.postAssignment);

// Routes d'authentification — toujours publiques
app.post('/api/auth/register', authRoutes.register);
app.post('/api/auth/login', authRoutes.login);

// Route pour vérifier son token (utile côté Angular au démarrage)
app.get('/api/auth/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// ── Routes protégées (nécessitent d'être admin) ────────────────────
app.put('/api/assignments', isAdmin, assignmentsRoutes.updateAssignment);
app.delete('/api/assignments/:id', isAdmin, assignmentsRoutes.deleteAssignment);

// ── Démarrage du serveur ───────────────────────────────────────────
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));