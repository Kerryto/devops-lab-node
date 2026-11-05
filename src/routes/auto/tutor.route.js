import express from "express";
const router = express.Router();

let tutors = [
  { id: 1, name: "Alice Dupont", subject: "Mathématiques", city: "Paris", price: 20 },
  { id: 2, name: "Marc Tremblay", subject: "Physique", city: "Lyon", price: 25 }
];

// GET all - Lister tous les tuteurs
router.get("/api/tutors", (req, res) => {
  res.status(200).json(tutors);
});

// GET by ID - Récupérer un tuteur spécifique
router.get("/api/tutors/:id", (req, res) => {
  const id = Number(req.params.id);
  const tutor = tutors.find(t => t.id === id);
  if (!tutor) return res.status(404).json({ error: "Tuteur non trouvé" });
  res.json(tutor);
});

// POST - Créer un nouveau tuteur
router.post("/api/tutors", (req, res) => {
  const { name, subject, city, price } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ error: "Champs requis manquants (name, subject)" });
  }
  const newTutor = { id: tutors.length + 1, name, subject, city, price };
  tutors.push(newTutor);
  res.status(201).json(newTutor);
});

// PUT - Mettre à jour un tuteur existant
router.put("/api/tutors/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tutors.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Tuteur non trouvé" });
  }
  tutors[index] = { ...tutors[index], ...req.body };
  res.json(tutors[index]);
});

// DELETE - Supprimer un tuteur
router.delete("/api/tutors/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = tutors.length;
  tutors = tutors.filter(t => t.id !== id);
  if (tutors.length === before) {
    return res.status(404).json({ error: "Tuteur non trouvé" });
  }
  res.status(204).end();
});

export default router;