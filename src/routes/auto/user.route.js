import express from 'express'

const router = express.Router()

const ROLES = ['STUDENT', 'TUTOR', 'ADMIN']

let users = [
  { id: 1, firstName: 'Sarah', lastName: 'Kaci', email: 'sarah.kaci@example.com', role: 'TUTOR', isActive: true },
  { id: 2, firstName: 'Léo', lastName: 'Martin', email: 'leo.martin@example.com', role: 'STUDENT', isActive: true },
  { id: 3, firstName: 'Admin', lastName: 'TutorMatch', email: 'admin@tutormatch.fr', role: 'ADMIN', isActive: true }
]

// Format d'e-mail simple : texte@texte.domaine
const isValidEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Un e-mail est unique, sans tenir compte des majuscules (on ignore l'utilisateur en cours de modification)
const emailTaken = (email, exceptId) =>
  users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== exceptId)

// Prochain identifiant libre : le plus grand id + 1 (jamais réutilisé après une suppression)
const nextId = () => users.reduce((max, u) => Math.max(max, u.id), 0) + 1

// Vérifie les champs envoyés ; renvoie un message d'erreur ou null
const validate = (body) => {
  if (body.email !== undefined && !isValidEmail(body.email)) return 'Adresse e-mail invalide'
  if (body.role !== undefined && !ROLES.includes(body.role)) return `Le rôle doit être ${ROLES.join(', ')}`
  if (body.isActive !== undefined && typeof body.isActive !== 'boolean') return 'isActive doit être un booléen'
  return null
}

// GET all - Lister les utilisateurs (filtre optionnel : ?role=TUTOR)
router.get('/api/users', (req, res) => {
  const { role } = req.query
  const result = role ? users.filter(u => u.role === role) : users
  res.status(200).json(result)
})

// GET by ID - Récupérer un utilisateur
router.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const user = users.find(u => u.id === id)
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' })
  res.json(user)
})

// POST - Créer un compte (élève par défaut)
router.post('/api/users', (req, res) => {
  const { firstName, lastName, email, role = 'STUDENT' } = req.body
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Champs requis manquants (firstName, lastName, email)' })
  }
  const error = validate({ email, role })
  if (error) return res.status(400).json({ error })
  if (emailTaken(email)) {
    return res.status(409).json({ error: 'Cette adresse e-mail est déjà utilisée' })
  }
  const newUser = { id: nextId(), firstName, lastName, email, role, isActive: true }
  users.push(newUser)
  res.status(201).json(newUser)
})

// PUT - Modifier un utilisateur (ex : { "isActive": false } pour désactiver un compte)
router.put('/api/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = users.findIndex(u => u.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' })
  }
  const error = validate(req.body)
  if (error) return res.status(400).json({ error })
  if (req.body.email !== undefined && emailTaken(req.body.email, id)) {
    return res.status(409).json({ error: 'Cette adresse e-mail est déjà utilisée' })
  }
  // On garde toujours l'id d'origine, même si le corps de la requête en contient un
  users[index] = { ...users[index], ...req.body, id }
  res.json(users[index])
})

// DELETE - Supprimer un compte
router.delete('/api/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const before = users.length
  users = users.filter(u => u.id !== id)
  if (users.length === before) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' })
  }
  res.status(204).end()
})

export default router
