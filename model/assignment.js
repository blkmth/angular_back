const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

// 🔥 Liste des matières (alignée avec ta base Mockaroo)
const MATIERES = [
  { nom: 'Angular', imageUrl: '/assets/angular.png', prof: 'Prof. Buffa' },
  { nom: 'Java', imageUrl: '/assets/java.png', prof: 'Prof. Gregory' },
  { nom: 'IA', imageUrl: '/assets/ia.png', prof: 'Prof. Keita' },
  { nom: 'DevOps', imageUrl: '/assets/devops.png', prof: 'Prof. Traoré' },
  { nom: 'Technologies Web', imageUrl: '/assets/web.png', prof: 'Prof. Assatou' },
  { nom: 'Grails', imageUrl: '/assets/grails.png', prof: 'Prof. Camara' },
  { nom: 'Java EE', imageUrl: '/assets/java.png', prof: 'Prof. Soro' },
  { nom: 'Cyber-sécurité', imageUrl: '/assets/security.png', prof: 'Prof. Galle' },
  { nom: 'UX/UI Design', imageUrl: '/assets/design.png', prof: 'Prof. Dubois' },
  { nom: 'Deep Learning', imageUrl: '/assets/deeplearning.png', prof: 'Prof. Madara' },
  { nom: 'Base de données', imageUrl: '/assets/database.png', prof: 'Prof. Diop' }
];

// 🔥 Schéma CORRIGÉ
let assignmentSchema = new Schema({
  id: Number,

  nom: String,
  nomDevoir: String,

  matiere: String, // ⚠️ IMPORTANT (pas matieres)

  professeur: {
    type: String,
    default: null
  },

  dateDeRendu: Date, // ⚠️ IMPORTANT

  rendu: Boolean,
  note: {
    type: Number,
    min: 0,
    max: 20
  },
  remarques: String,

  imageMatiere: String,
  auteur: String
});

// pagination
assignmentSchema.plugin(mongooseAggregatePaginate);

module.exports.MATIERES = MATIERES;
module.exports.Assignment = mongoose.model('Assignment', assignmentSchema);