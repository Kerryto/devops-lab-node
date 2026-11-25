import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Reviews API CRUD', () => {
  let createdId

  it('GET /api/reviews devrait retourner un tableau (200)', async () => {
    const res = await request(app).get('/api/reviews')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/reviews?tutorId=1 devrait filtrer les avis d\'un tuteur', async () => {
    const res = await request(app).get('/api/reviews').query({ tutorId: 1 })
    expect(res.status).toBe(200)
    expect(res.body.every(r => r.tutorId === 1)).toBe(true)
  })

  it('POST /api/reviews devrait créer un nouvel avis (201)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ tutorId: 1, studentName: 'Chloé', rating: 4, comment: 'Très pédagogue' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.rating).toBe(4)
    createdId = res.body.id
  })

  it('POST /api/reviews sans commentaire devrait enregistrer un commentaire vide', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ tutorId: 2, studentName: 'Hugo', rating: 3 })
    expect(res.status).toBe(201)
    expect(res.body.comment).toBe('')
  })

  it('POST /api/reviews devrait refuser des champs manquants (400)', async () => {
    const res = await request(app).post('/api/reviews').send({ studentName: 'Chloé' })
    expect(res.status).toBe(400)
  })

  it('POST /api/reviews devrait refuser une note hors de 1 à 5 (400)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ tutorId: 1, studentName: 'Chloé', rating: 6 })
    expect(res.status).toBe(400)
  })

  it('GET /api/reviews/:id devrait retourner l\'avis créé (200)', async () => {
    const res = await request(app).get(`/api/reviews/${createdId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(createdId)
  })

  it('PUT /api/reviews/:id devrait mettre à jour l\'avis (200) sans changer son id', async () => {
    const res = await request(app)
      .put(`/api/reviews/${createdId}`)
      .send({ id: 999, rating: 5, comment: 'Excellent finalement' })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: createdId, rating: 5, comment: 'Excellent finalement' })
  })

  it('PUT /api/reviews/:id devrait refuser une note invalide (400)', async () => {
    const res = await request(app).put(`/api/reviews/${createdId}`).send({ rating: 0 })
    expect(res.status).toBe(400)
  })

  it('PUT /api/reviews/:id devrait retourner 404 pour un avis inexistant', async () => {
    const res = await request(app).put('/api/reviews/9999').send({ rating: 3 })
    expect(res.status).toBe(404)
  })

  it('DELETE /api/reviews/:id devrait supprimer l\'avis (204)', async () => {
    const res = await request(app).delete(`/api/reviews/${createdId}`)
    expect(res.status).toBe(204)
  })

  it('GET /api/reviews/:id devrait retourner 404 pour un avis supprimé', async () => {
    const res = await request(app).get(`/api/reviews/${createdId}`)
    expect(res.status).toBe(404)
  })

  it('DELETE /api/reviews/:id devrait retourner 404 pour un avis inexistant', async () => {
    const res = await request(app).delete(`/api/reviews/${createdId}`)
    expect(res.status).toBe(404)
  })

  it('POST /api/reviews ne devrait jamais réutiliser un id après une suppression', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ tutorId: 1, studentName: 'Inès', rating: 5 })
    const ids = (await request(app).get('/api/reviews')).body.map(r => r.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(res.body.id).not.toBe(createdId)
  })
})
