import express from 'express'

const router = express.Router()

// "Base de données" en mémoire (comme pour doctors et patients dans le sujet)
const appointments = [
  { id: 1, doctor: 'Dr. Sarah Lee', patient: 'Alice', date: '2026-11-20' },
  { id: 2, doctor: 'Dr. Amir Khan', patient: 'John', date: '2026-11-21' }
]

// Vérifie qu'une chaîne est une date réelle au format YYYY-MM-DD
function isValidDate (value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const d = new Date(value)
  // On compare à la valeur reconstruite pour rejeter par exemple 2026-02-31
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

// GET /api/appointments : liste de tous les rendez-vous
router.get('/', (req, res) => res.status(200).json(appointments))

// GET /api/appointments/:id : un rendez-vous précis
router.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const appointment = appointments.find((a) => a.id === id)
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' })
  }
  res.status(200).json(appointment)
})

// POST /api/appointments : crée un rendez-vous
router.post('/', (req, res) => {
  const { doctor, patient, date } = req.body ?? {}

  if (!doctor || !patient || !date) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format (expected YYYY-MM-DD)' })
  }

  const nextId = appointments.reduce((max, a) => Math.max(max, a.id), 0) + 1
  const newAppointment = { id: nextId, doctor, patient, date }
  appointments.push(newAppointment)
  res.status(201).json(newAppointment)
})

export default router
