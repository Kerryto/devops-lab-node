import express from 'express'

const router = express.Router()

// Créneaux d'une heure publiés par les tuteurs ; un élève réserve un créneau libre
let slots = [
  { id: 1, tutorId: 1, startAt: '2027-01-15T17:00:00.000Z', endAt: '2027-01-15T18:00:00.000Z', isBooked: false },
  { id: 2, tutorId: 1, startAt: '2027-01-16T17:00:00.000Z', endAt: '2027-01-16T18:00:00.000Z', isBooked: true },
  { id: 3, tutorId: 2, startAt: '2027-01-17T09:00:00.000Z', endAt: '2027-01-17T10:00:00.000Z', isBooked: false }
]

// Compteur d'identifiants : il ne recule jamais, donc un id n'est jamais réutilisé après une suppression
let lastId = slots.reduce((max, s) => Math.max(max, s.id), 0)
const nextId = () => ++lastId

// Vérifie le couple de dates ; renvoie un message d'erreur ou null
const checkDates = (startAt, endAt) => {
  const start = new Date(startAt)
  const end = new Date(endAt)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Dates invalides (format ISO attendu)'
  if (start.getTime() <= Date.now()) return 'Le créneau doit commencer dans le futur'
  if (end.getTime() <= start.getTime()) return 'endAt doit être après startAt'
  return null
}

// GET all - Lister les créneaux (filtres optionnels : ?tutorId=1 et ?available=true)
router.get('/api/slots', (req, res) => {
  let result = slots
  if (req.query.tutorId) result = result.filter(s => s.tutorId === Number(req.query.tutorId))
  if (req.query.available === 'true') result = result.filter(s => !s.isBooked)
  res.status(200).json(result)
})

// GET by ID - Récupérer un créneau
router.get('/api/slots/:id', (req, res) => {
  const id = Number(req.params.id)
  const slot = slots.find(s => s.id === id)
  if (!slot) return res.status(404).json({ error: 'Créneau non trouvé' })
  res.json(slot)
})

// POST - Publier un créneau (libre par défaut)
router.post('/api/slots', (req, res) => {
  const { tutorId, startAt, endAt } = req.body
  if (!tutorId || !startAt || !endAt) {
    return res.status(400).json({ error: 'Champs requis manquants (tutorId, startAt, endAt)' })
  }
  const error = checkDates(startAt, endAt)
  if (error) return res.status(400).json({ error })
  const newSlot = { id: nextId(), tutorId, startAt, endAt, isBooked: false }
  slots.push(newSlot)
  res.status(201).json(newSlot)
})

// PUT - Modifier un créneau (dates, ou réservation avec { "isBooked": true })
router.put('/api/slots/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = slots.findIndex(s => s.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Créneau non trouvé' })
  }
  const updated = { ...slots[index], ...req.body, id }
  if (req.body.isBooked !== undefined && typeof req.body.isBooked !== 'boolean') {
    return res.status(400).json({ error: 'isBooked doit être un booléen' })
  }
  if (req.body.startAt !== undefined || req.body.endAt !== undefined) {
    const error = checkDates(updated.startAt, updated.endAt)
    if (error) return res.status(400).json({ error })
  }
  slots[index] = updated
  res.json(slots[index])
})

// DELETE - Supprimer un créneau (impossible s'il est déjà réservé)
router.delete('/api/slots/:id', (req, res) => {
  const id = Number(req.params.id)
  const slot = slots.find(s => s.id === id)
  if (!slot) return res.status(404).json({ error: 'Créneau non trouvé' })
  if (slot.isBooked) {
    return res.status(409).json({ error: 'Un créneau réservé ne peut pas être supprimé' })
  }
  slots = slots.filter(s => s.id !== id)
  res.status(204).end()
})

export default router
