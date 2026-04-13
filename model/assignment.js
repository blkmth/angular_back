const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

// liste fixe des matieres disponibles 
// cahque matiere a un nom , une image et prof associé 

const MATIERES = [
    { nom: 'Angular', imageUrl: '/assets/angular.png', prof: 'Prof. Kouassi' },
    { nom: 'Base de données', imageUrl: '/assets/database.png', prof: 'Prof. Diop' },
    { nom: 'Technologies Web', imageUrl: '/assets/web.png', prof: 'Prof. Traoré' },
    { nom: 'Grails', imageUrl: '/assets/grails.png', prof: 'Prof. Mensah' },
    { nom: 'Java EE', imageUrl: '/assets/java.png', prof: 'Prof. N\'Guessan' },
    { nom: 'DevOps', imageUrl: '/assets/devops.png', prof: 'Prof. Sow' },
    { nom: 'Intelligence Artificielle', imageUrl: '/assets/ia.png', prof: 'Prof. Keita' },
    { nom: 'Cyber-sécurité', imageUrl: '/assets/security.png', prof: 'Prof. Okoro' },
    { nom: 'Développement Mobile', imageUrl: '/assets/mobile.png', prof: 'Prof. Diallo' },
    { nom: 'Big Data', imageUrl: '/assets/bigdata.png', prof: 'Prof. Talla' },
    { nom: 'Blockchain', imageUrl: '/assets/blockchain.png', prof: 'Prof. M\'Barki' },
    { nom: 'Cloud Computing', imageUrl: '/assets/cloud.png', prof: 'Prof. Touré' },
    { nom: 'Réseaux Avancés', imageUrl: '/assets/networks.png', prof: 'Prof. Kone' },
    { nom: 'Management SI', imageUrl: '/assets/management.png', prof: 'Prof. Sangaré' },
    { nom: 'Python pour la Data', imageUrl: '/assets/python.png', prof: 'Prof. Balogun' },
    { nom: 'Algorithmique', imageUrl: '/assets/algo.png', prof: 'Prof. Koffi' },
    { nom: 'Cryptographie', imageUrl: '/assets/crypto.png', prof: 'Prof. Sylla' },
    { nom: 'UX/UI Design', imageUrl: '/assets/design.png', prof: 'Prof. Adeyemi' },
    { nom: 'Qualité Logicielle', imageUrl: '/assets/quality.png', prof: 'Prof. Camara' },
    { nom: 'Internet des Objets (IoT)', imageUrl: '/assets/iot.png', prof: 'Prof. Bamba' },
    { nom: 'Management de Projet', imageUrl: '/assets/pm.png', prof: 'Prof. Ouedraogo' },
    { nom: 'Entrepreneuriat Tech', imageUrl: '/assets/business.png', prof: 'Prof. Gbagbo' },
    { nom: 'Deep Learning', imageUrl: '/assets/deeplearning.png', prof: 'Prof. Sidibé' },
    { nom: 'Architecture Microservices', imageUrl: '/assets/microservices.png', prof: 'Prof. Kamara' },
    { nom: 'Soft Skills', imageUrl: '/assets/softskills.png', prof: 'Prof. Fall' },
    { nom: 'Anglais Technique', imageUrl: '/assets/english.png', prof: 'Prof. Yao' },
];

// Les assignments 

let assignmentSchema = new Schema({
    id: { type: Number },

    nom: { type: String },

    dateDeRendu: { type: Date, required: true },

    rendu: { type: Boolean, default: false },

    matiere: {
        type: String,
        // on stock juste le nom , le front recupere image/prof via la liste
        default: 'Angular'
    },

    auteur: { type: String, default: 'Anonyme' },

    note: {
        type: Number,
        min: 0,
        max: 20,
        default: null
    },

    remarque: { type: String, default: '' },
});

// Pour la pagination, on ajoute le plugin mongoose-aggregate-paginate-v2 
// au schéma Mongoose test de push
AssignmentSchema.plugin(aggregatePaginate);

// export de la liste des matieres pour les routes 
module.exports.MATIERES = MATIERES;
module.exports.Assignment = mongoose.model('Assignment', assignmentSchema);