import express from 'express'

const router = express.Router()

let reviews = [
  { id: 1, tutorId: 1, studentName: 'Alice', rating: 5, comment: 'Excellent tuteur !' },
  { id: 2, tutorId: 2, studentName: 'Bob', rating: 4, comment: 'Très clair et ponctuel.' }
]

// Une note est un entier entre 1 et 5
const isValidRating = (rating) => Number.isInteger(rating) && rating >= 1 && rating <= 5

// Prochain identifiant libre : le plus grand id + 1
// (avec reviews.length + 1, un id pourrait être réutilisé après une suppression)
const nextId = () => reviews.reduce((max, r) => Math.max(max, r.id), 0) + 1

// GET all - Lister tous les avis (filtre optionnel : ?tutorId=1)
router.get('/api/reviews', (req, res) => {
  const tutorId = Number(req.query.tutorId)
  const result = req.query.tutorId ? reviews.filter(r => r.tutorId === tutorId) : reviews
  res.status(200).json(result)
})

// GET by ID - Récupérer un avis spécifique
router.get('/api/reviews/:id', (req, res) => {
  const id = Number(req.params.id)
  const review = reviews.find(r => r.id === id)
  if (!review) return res.status(404).json({ error: 'Avis non trouvé' })
  res.json(review)
})

// POST - Créer un nouvel avis
router.post('/api/reviews', (req, res) => {
  const { tutorId, studentName, rating, comment } = req.body
  if (!tutorId || !studentName || rating === undefined) {
    return res.status(400).json({ error: 'Champs requis manquants (tutorId, studentName, rating)' })
  }
  if (!isValidRating(rating)) {
    return res.status(400).json({ error: 'La note doit être un entier entre 1 et 5' })
  }
  const newReview = { id: nextId(), tutorId, studentName, rating, comment: comment || '' }
  reviews.push(newReview)
  res.status(201).json(newReview)
})

// PUT - Mettre à jour un avis existant
router.put('/api/reviews/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = reviews.findIndex(r => r.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Avis non trouvé' })
  }
  if (req.body.rating !== undefined && !isValidRating(req.body.rating)) {
    return res.status(400).json({ error: 'La note doit être un entier entre 1 et 5' })
  }
  // On garde toujours l'id d'origine, même si le corps de la requête en contient un
  reviews[index] = { ...reviews[index], ...req.body, id }
  res.json(reviews[index])
})

// DELETE - Supprimer un avis
router.delete('/api/reviews/:id', (req, res) => {
  const id = Number(req.params.id)
  const before = reviews.length
  reviews = reviews.filter(r => r.id !== id)
  if (reviews.length === before) {
    return res.status(404).json({ error: 'Avis non trouvé' })
  }
  res.status(204).end()
})

export default router
