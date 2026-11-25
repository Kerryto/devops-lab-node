import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Users API CRUD', () => {
  let createdId

  it('GET /api/users devrait retourner un tableau (200)', async () => {
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/users?role=TUTOR devrait ne renvoyer que les tuteurs', async () => {
    const res = await request(app).get('/api/users').query({ role: 'TUTOR' })
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body.every(u => u.role === 'TUTOR')).toBe(true)
  })

  it('POST /api/users devrait créer un élève actif par défaut (201)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ firstName: 'Chloé', lastName: 'Durand', email: 'chloe.durand@example.com' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toMatchObject({ role: 'STUDENT', isActive: true })
    createdId = res.body.id
  })

  it('POST /api/users devrait accepter le rôle TUTOR (201)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ firstName: 'Hugo', lastName: 'Petit', email: 'hugo.petit@example.com', role: 'TUTOR' })
    expect(res.status).toBe(201)
    expect(res.body.role).toBe('TUTOR')
  })

  it('POST /api/users devrait refuser des champs manquants (400)', async () => {
    const res = await request(app).post('/api/users').send({ firstName: 'Chloé' })
    expect(res.status).toBe(400)
  })

  it('POST /api/users devrait refuser un e-mail invalide (400)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ firstName: 'Chloé', lastName: 'Durand', email: 'pas-un-email' })
    expect(res.status).toBe(400)
  })

  it('POST /api/users devrait refuser un rôle inconnu (400)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ firstName: 'Max', lastName: 'Roy', email: 'max.roy@example.com', role: 'SUPERUSER' })
    expect(res.status).toBe(400)
  })

  it('POST /api/users devrait refuser un e-mail déjà utilisé, même en majuscules (409)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ firstName: 'Autre', lastName: 'Personne', email: 'CHLOE.DURAND@example.com' })
    expect(res.status).toBe(409)
  })

  it('GET /api/users/:id devrait retourner l\'utilisateur créé (200)', async () => {
    const res = await request(app).get(`/api/users/${createdId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(createdId)
  })

  it('PUT /api/users/:id devrait désactiver le compte (200) sans changer son id', async () => {
    const res = await request(app)
      .put(`/api/users/${createdId}`)
      .send({ id: 999, isActive: false })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: createdId, isActive: false })
  })

  it('PUT /api/users/:id devrait refuser un isActive qui n\'est pas un booléen (400)', async () => {
    const res = await request(app).put(`/api/users/${createdId}`).send({ isActive: 'non' })
    expect(res.status).toBe(400)
  })

  it('PUT /api/users/:id devrait refuser l\'e-mail d\'un autre utilisateur (409)', async () => {
    const res = await request(app)
      .put(`/api/users/${createdId}`)
      .send({ email: 'sarah.kaci@example.com' })
    expect(res.status).toBe(409)
  })

  it('PUT /api/users/:id devrait accepter de garder son propre e-mail (200)', async () => {
    const res = await request(app)
      .put(`/api/users/${createdId}`)
      .send({ email: 'chloe.durand@example.com', lastName: 'Durand-Leroy' })
    expect(res.status).toBe(200)
    expect(res.body.lastName).toBe('Durand-Leroy')
  })

  it('PUT /api/users/:id devrait retourner 404 pour un utilisateur inexistant', async () => {
    const res = await request(app).put('/api/users/9999').send({ firstName: 'X' })
    expect(res.status).toBe(404)
  })

  it('DELETE /api/users/:id devrait supprimer l\'utilisateur (204)', async () => {
    const res = await request(app).delete(`/api/users/${createdId}`)
    expect(res.status).toBe(204)
  })

  it('GET /api/users/:id devrait retourner 404 pour un utilisateur supprimé', async () => {
    const res = await request(app).get(`/api/users/${createdId}`)
    expect(res.status).toBe(404)
  })

  it('DELETE /api/users/:id devrait retourner 404 pour un utilisateur inexistant', async () => {
    const res = await request(app).delete(`/api/users/${createdId}`)
    expect(res.status).toBe(404)
  })

  it('POST /api/users ne devrait jamais réutiliser un id après une suppression', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ firstName: 'Inès', lastName: 'Bernard', email: 'ines.bernard@example.com' })
    const ids = (await request(app).get('/api/users')).body.map(u => u.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(res.body.id).not.toBe(createdId)
  })
})
