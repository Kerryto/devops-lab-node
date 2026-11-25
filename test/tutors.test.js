import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Tutors API CRUD', () => {
  let createdTutorId

  it('GET /api/tutors devrait retourner un tableau (200)', async () => {
    const res = await request(app).get('/api/tutors')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/tutors devrait créer un nouveau tuteur (201)', async () => {
    const res = await request(app)
      .post('/api/tutors')
      .send({ name: 'Sophie Martin', subject: 'Anglais', city: 'Lille', price: 22 })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Sophie Martin')

    // Sauvegarde l'ID généré pour l'utiliser dans les tests suivants
    createdTutorId = res.body.id
  })

  it('GET /api/tutors/:id devrait retourner le tuteur créé (200)', async () => {
    const res = await request(app).get(`/api/tutors/${createdTutorId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(createdTutorId)
  })

  it('PUT /api/tutors/:id devrait mettre à jour le tuteur (200)', async () => {
    const res = await request(app)
      .put(`/api/tutors/${createdTutorId}`)
      .send({ price: 30 })

    expect(res.status).toBe(200)
    expect(res.body.price).toBe(30)
  })

  it('DELETE /api/tutors/:id devrait supprimer le tuteur (204)', async () => {
    const res = await request(app).delete(`/api/tutors/${createdTutorId}`)
    expect(res.status).toBe(204)
  })

  it('GET /api/tutors/:id devrait retourner une erreur 404 pour un tuteur supprimé', async () => {
    const res = await request(app).get(`/api/tutors/${createdTutorId}`)
    expect(res.status).toBe(404)
  })
})
