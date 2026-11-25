import express from 'express'

const router = express.Router()

router.use(express.json())

let slots = [
  { id: 1, doctor: 'Dr. Sarah Lee', date: '2026-12-01', time: '09:00' },
  { id: 2, doctor: 'Dr. Amir Khan', date: '2026-12-01', time: '10:30' }
]

// GET all
router.get('/api/slots', (_req, res) => {
  res.status(200).json(slots)
})

// GET by ID
router.get('/api/slots/:id', (req, res) => {
  const id = Number(req.params.id)
  const slot = slots.find(s => s.id === id)
  if (!slot) return res.status(404).json({ error: 'Slot not found' })
  res.json(slot)
})

// POST
router.post('/api/slots', (req, res) => {
  const { doctor, date, time } = req.body ?? {}
  if (!doctor || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const nextId = slots.reduce((max, s) => Math.max(max, s.id), 0) + 1
  const newSlot = { id: nextId, doctor, date, time }
  slots.push(newSlot)
  res.status(201).json(newSlot)
})

// PUT (mise à jour partielle, comme dans le sujet)
router.put('/api/slots/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = slots.findIndex(s => s.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Slot not found' })
  }
  slots[index] = { ...slots[index], ...req.body, id }
  res.json(slots[index])
})

// DELETE
router.delete('/api/slots/:id', (req, res) => {
  const id = Number(req.params.id)
  const before = slots.length
  slots = slots.filter(s => s.id !== id)
  if (slots.length === before) {
    return res.status(404).json({ error: 'Slot not found' })
  }
  res.status(204).end()
})

export default router
