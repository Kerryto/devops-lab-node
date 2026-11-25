import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('Subjects API CRUD', () => {
  let createdSubjectId

  // GET all
  it('GET /api/subjects devrait retourner un tableau (200)', async () => {
    const res = await request(app).get('/api/subjects')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(3)
  })

  // POST
  it('POST /api/subjects devrait créer une matière (201)', async () => {
    const res = await request(app)
      .post('/api/subjects')
      .send({
        name: 'Informatique',
        levels: ['LYCEE', 'UNIVERSITY']
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Informatique')
    expect(res.body.levels).toEqual(['LYCEE', 'UNIVERSITY'])

    createdSubjectId = res.body.id
  })

  // GET by ID
  it('GET /api/subjects/:id devrait retourner la matière créée (200)', async () => {
    const res = await request(app).get(`/api/subjects/${createdSubjectId}`)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(createdSubjectId)
  })

  // PUT
  it('PUT /api/subjects/:id devrait modifier une matière (200)', async () => {
    const res = await request(app)
      .put(`/api/subjects/${createdSubjectId}`)
      .send({ name: 'Développement informatique' })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Développement informatique')
  })

  // DELETE
  it('DELETE /api/subjects/:id devrait supprimer une matière (204)', async () => {
    const res = await request(app).delete(`/api/subjects/${createdSubjectId}`)

    expect(res.status).toBe(204)
  })

  // GET after DELETE
  it('GET /api/subjects/:id devrait retourner 404 après suppression', async () => {
    const res = await request(app).get(`/api/subjects/${createdSubjectId}`)

    expect(res.status).toBe(404)
  })

  // POST invalid data
  it('POST /api/subjects devrait refuser un niveau invalide (400)', async () => {
    const res = await request(app)
      .post('/api/subjects')
      .send({
        name: 'Histoire',
        levels: ['PRIMAIRE']
      })

    expect(res.status).toBe(400)
  })

  // GET unknown ID
  it('GET /api/subjects devrait retourner 404 pour un ID inconnu', async () => {
    const res = await request(app).get('/api/subjects/99999')

    expect(res.status).toBe(404)
  })
})
