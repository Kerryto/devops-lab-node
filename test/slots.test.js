import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Slots API CRUD', () => {
  const valid = { tutorId: 2, startAt: '2027-02-01T18:00:00.000Z', endAt: '2027-02-01T19:00:00.000Z' }
  let createdId

  it('GET /api/slots devrait retourner un tableau (200)', async () => {
    const res = await request(app).get('/api/slots')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/slots?tutorId=1 devrait ne renvoyer que les créneaux de ce tuteur', async () => {
    const res = await request(app).get('/api/slots').query({ tutorId: 1 })
    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body.every(s => s.tutorId === 1)).toBe(true)
  })

  it('GET /api/slots?available=true devrait exclure les créneaux réservés', async () => {
    const res = await request(app).get('/api/slots').query({ available: 'true' })
    expect(res.status).toBe(200)
    expect(res.body.every(s => s.isBooked === false)).toBe(true)
  })

  it('POST /api/slots devrait créer un créneau libre (201)', async () => {
    const res = await request(app).post('/api/slots').send(valid)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toMatchObject({ tutorId: 2, isBooked: false })
    createdId = res.body.id
  })

  it('POST /api/slots devrait refuser des champs manquants (400)', async () => {
    const res = await request(app).post('/api/slots').send({ tutorId: 1 })
    expect(res.status).toBe(400)
  })

  it('POST /api/slots devrait refuser une date invalide (400)', async () => {
    const res = await request(app).post('/api/slots').send({ ...valid, startAt: 'demain' })
    expect(res.status).toBe(400)
  })

  it('POST /api/slots devrait refuser un créneau dans le passé (400)', async () => {
    const res = await request(app)
      .post('/api/slots')
      .send({ tutorId: 1, startAt: '2020-01-01T10:00:00.000Z', endAt: '2020-01-01T11:00:00.000Z' })
    expect(res.status).toBe(400)
  })

  it('POST /api/slots devrait refuser endAt avant startAt (400)', async () => {
    const res = await request(app)
      .post('/api/slots')
      .send({ ...valid, endAt: '2027-02-01T17:00:00.000Z' })
    expect(res.status).toBe(400)
  })

  it('GET /api/slots/:id devrait retourner le créneau créé (200)', async () => {
    const res = await request(app).get(`/api/slots/${createdId}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(createdId)
  })

  it('PUT /api/slots/:id devrait modifier les horaires (200) sans changer l\'id', async () => {
    const res = await request(app)
      .put(`/api/slots/${createdId}`)
      .send({ id: 999, startAt: '2027-02-02T18:00:00.000Z', endAt: '2027-02-02T19:00:00.000Z' })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: createdId, startAt: '2027-02-02T18:00:00.000Z' })
  })

  it('PUT /api/slots/:id devrait refuser des horaires incohérents (400)', async () => {
    const res = await request(app)
      .put(`/api/slots/${createdId}`)
      .send({ endAt: '2027-02-01T08:00:00.000Z' })
    expect(res.status).toBe(400)
  })

  it('PUT /api/slots/:id devrait refuser un isBooked qui n\'est pas un booléen (400)', async () => {
    const res = await request(app).put(`/api/slots/${createdId}`).send({ isBooked: 'oui' })
    expect(res.status).toBe(400)
  })

  it('PUT /api/slots/:id devrait retourner 404 pour un créneau inexistant', async () => {
    const res = await request(app).put('/api/slots/9999').send({ isBooked: true })
    expect(res.status).toBe(404)
  })

  it('DELETE /api/slots/:id devrait refuser de supprimer un créneau réservé (409)', async () => {
    const res = await request(app).delete('/api/slots/2')
    expect(res.status).toBe(409)
  })

  it('DELETE /api/slots/:id devrait supprimer un créneau libre (204)', async () => {
    const res = await request(app).delete(`/api/slots/${createdId}`)
    expect(res.status).toBe(204)
  })

  it('GET /api/slots/:id devrait retourner 404 pour un créneau supprimé', async () => {
    const res = await request(app).get(`/api/slots/${createdId}`)
    expect(res.status).toBe(404)
  })

  it('DELETE /api/slots/:id devrait retourner 404 pour un créneau inexistant', async () => {
    const res = await request(app).delete(`/api/slots/${createdId}`)
    expect(res.status).toBe(404)
  })

  it('POST /api/slots ne devrait jamais réutiliser un id après une suppression', async () => {
    const res = await request(app).post('/api/slots').send(valid)
    const ids = (await request(app).get('/api/slots')).body.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(res.body.id).not.toBe(createdId)
  })
})
