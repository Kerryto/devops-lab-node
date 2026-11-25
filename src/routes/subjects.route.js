import express from 'express'

const router = express.Router()

const VALID_LEVELS = ['COLLEGE', 'LYCEE', 'UNIVERSITY']

let subjects = [
  { id: 1, name: 'Mathématiques', levels: ['COLLEGE', 'LYCEE', 'UNIVERSITY'] },
  { id: 2, name: 'Physique', levels: ['COLLEGE', 'LYCEE', 'UNIVERSITY'] },
  { id: 3, name: 'Anglais', levels: ['COLLEGE', 'LYCEE', 'UNIVERSITY'] }
]

// Vérifie que les niveaux sont valides
function isValidLevels (levels) {
  return Array.isArray(levels) &&
    levels.length > 0 &&
    levels.every(level => VALID_LEVELS.includes(level))
}

// GET /api/subjects : récupérer toutes les matières
router.get('/', (req, res) => {
  res.status(200).json(subjects)
})

// GET /api/subjects/:id : récupérer une matière
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const subject = subjects.find(s => s.id === id)

  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' })
  }

  res.status(200).json(subject)
})

// POST /api/subjects : créer une matière
router.post('/', (req, res) => {
  const { name, levels } = req.body ?? {}

  if (typeof name !== 'string' || !name.trim() || !isValidLevels(levels)) {
    return res.status(400).json({ error: 'Invalid name or levels' })
  }

  const nextId = subjects.reduce((max, s) => Math.max(max, s.id), 0) + 1

  const newSubject = {
    id: nextId,
    name: name.trim(),
    levels
  }

  subjects.push(newSubject)

  res.status(201).json(newSubject)
})

// PUT /api/subjects/:id : modifier une matière
router.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = subjects.findIndex(s => s.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Subject not found' })
  }

  const { name, levels } = req.body ?? {}

  if (
    (name !== undefined && (typeof name !== 'string' || !name.trim())) ||
    (levels !== undefined && !isValidLevels(levels))
  ) {
    return res.status(400).json({ error: 'Invalid name or levels' })
  }

  subjects[index] = {
    ...subjects[index],
    ...(name !== undefined ? { name: name.trim() } : {}),
    ...(levels !== undefined ? { levels } : {})
  }

  res.status(200).json(subjects[index])
})

// DELETE /api/subjects/:id : supprimer une matière
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const before = subjects.length

  subjects = subjects.filter(s => s.id !== id)

  if (subjects.length === before) {
    return res.status(404).json({ error: 'Subject not found' })
  }

  res.status(204).end()
})

export default router
