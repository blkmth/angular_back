const { Assignment, MATIERES } = require('../model/assignment');


// ✅ GET TOUS LES ASSIGNMENTS
function getAssignments(req, res) {
  Assignment.find((err, assignments) => {
    if (err) return res.status(500).send(err);

    const profs = {
      "Angular": "Prof. Buffa",
      "Java": "Prof. Gregory",
      "IA": "Prof. Keita",
      "DevOps": "Prof. Traoré",
      "Technologies Web": "Prof. Assatou",
      "Grails": "Prof. Camara",
      "Java EE": "Prof. Soro",
      "Cyber-sécurité": "Prof. Galle",
      "UX/UI Design": "Prof. Dubois",
      "Deep Learning": "Prof. Madara",
      "Base de données": "Prof. Diop"
    };

    // 🔥 transformation des données
    const result = assignments.map(a => ({
      _id: a._id,
      nom: a.Nom,
      nomDevoir: a.nomDevoir,
      matiere: a.matieres,
      professeur: profs[a.matieres] || "Prof. Inconnu",
      dateDeRendu: a.dateRendu,
      rendu: a.rendu,
      note: a.note,
      remarques: a.remarques,
      imageMatiere: a.imageMatiere,
      auteur: a.auteur
    }));

    res.json(result);
  });
}


// ✅ GET UN SEUL ASSIGNMENT
function getAssignment(req, res) {
  let assignmentId = req.params.id;

  Assignment.findById(assignmentId, (err, assignment) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!assignment) {
      return res.status(404).send("Not found");
    }

    const profs = {
      "Angular": "Prof. Buffa",
      "Java": "Prof. Gregory",
      "IA": "Prof. Keita",
      "DevOps": "Prof. Traoré",
      "Technologies Web": "Prof. Assatou",
      "Grails": "Prof. Camara",
      "Java EE": "Prof. Soro",
      "Cyber-sécurité": "Prof. Galle",
      "UX/UI Design": "Prof. Dubois",
      "Deep Learning": "Prof. Madara",
      "Base de données": "Prof. Diop"
    };

    assignment.professeur = profs[assignment.matiere] || "Prof. Nguessan";

    res.json(assignment);
  });
}


// ✅ POST
function postAssignment(req, res) {
  let assignment = new Assignment();

  assignment.nom = req.body.nom;
  assignment.nomDevoir = req.body.nomDevoir;
  assignment.matiere = req.body.matiere;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.rendu = req.body.rendu;

  assignment.note = req.body.note;
  assignment.remarques = req.body.remarques;

  assignment.imageMatiere = req.body.imageMatiere;
  assignment.auteur = req.body.auteur;
  
  assignment.save((err, saved) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: 'saved',
      _id: saved._id // 🔥 IMPORTANT
    });
  });
}


// ✅ UPDATE
function updateAssignment(req, res) {
  Assignment.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true }
  )
  .then(() => res.json({ message: "updated" }))
  .catch(err => res.status(500).json(err));
}


// ✅ DELETE
function deleteAssignment(req, res) {
  Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
    if (err) return res.send(err);
    res.json({ message: `${assignment.nom} deleted` });
  });
}


// ✅ MATIERES
function getMatieres(req, res) {
  res.json(MATIERES);
}

function getAssignmentsPagine(req, res) { 
  let page = parseInt(req.query.page || 1);
  let limit = parseInt(req.query.limit || 10);
  let search = req.query.search || '';

  const options = {
    page: page,
    limit: limit,
  };

  // 🔥 FILTRE (ajout sans casser MATIERES)
  let match = {};

  if (search !== '') {
    match = {
      nom: { $regex: search, $options: 'i' }
    };
  }
  

  Assignment.aggregatePaginate(
    Assignment.aggregate([
      { $match: match } // 🔥 IMPORTANT
    ]),
    options
  )
    .then(result => {

      console.log("DATA FROM DB:", result.docs.length);

      // 🔥 TON CODE (ON GARDE)
      result.docs.forEach(a => {

        const matiere = MATIERES.find(m => m.nom === a.matiere);
        a.professeur = matiere ? matiere.prof : "Prof. Inconnu";

        if (a.dateDeRendu && typeof a.dateDeRendu === "string") {
          const parts = a.dateDeRendu.split('/');
          if (parts.length === 3) {
            a.dateDeRendu = new Date(parts[2], parts[1] - 1, parts[0]);
          }
        }
      });

      res.json(result);
    })
    .catch(err => {
      console.error("❌ ERREUR :", err);
      res.status(500).json(err);
    });
}



Assignment.find().then(data => {
  console.log("DATA FROM DB:", data.length);
});

// ✅ EXPORT
module.exports = {
  getAssignments,
  getAssignment,
  postAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentsPagine,
  getMatieres
};