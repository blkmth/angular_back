let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignment = require('./routes/assignments');

// Pour externaliser la configuration (URI de connexion à la base, 
// port du serveur, etc), et on peut aussi utiliser des variables 
// d'environnement, pour le PORT etc.
require('dotenv').config();

let port = process.env.PORT || 8010;

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
//const uri = 'mongodb+srv://...';
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI manquant. Créez un fichier .env ou définissez la variable d\'environnement.');
  process.exit(1);
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires (URL ENCODED, ce sont des formulaires classiques) et 
// pour les données JSON (Content-Type: application/json)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// les routes
const prefix = '/api';  // /api/assignments GET POST PUT

app.route(prefix + '/assignments')
  .get(assignment.getAssignments)
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);

app.route(prefix + '/assignments/:id')
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log(`Vérifiez avec http://localhost:${port}/api/assignments que cela fonctionne`);

    // On démarre le serveur seulement après la connexion réussie à la base
    app.listen(port, () => {
      console.log('Serveur démarré sur le port : ' + port);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion MongoDB : ', err);
    process.exit(1); // On arrête le processus si la connexion échoue
  });

module.exports = app;


