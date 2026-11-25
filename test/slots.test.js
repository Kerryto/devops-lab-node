import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Slots API', () => {
  const valid = { doctor: 'Dr. Lee', date: '2026-12-05', time: '14:00' }

  it('GET /api/slots returns an array', async () => {
    const res = await request(app).get('/api/slots')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/slots/:id returns a slot', async () => {
    const res = await request(app).get('/api/slots/1')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', 1)
  })

  it('GET /api/slots/:id returns 404 if not found', async () => {
    const res = await request(app).get('/api/slots/9999')
    expect(res.status).toBe(404)
  })

  it('POST /api/slots creates a slot', async () => {
    const res = await request(app).post('/api/slots').send(valid)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.doctor).toBe('Dr. Lee')
  })

  it('POST /api/slots returns 400 when a field is missing', async () => {
    const res = await request(app).post('/api/slots').send({ doctor: 'Dr. Lee' })
    expect(res.status).toBe(400)
  })

  it('PUT /api/slots/:id updates only the given fields', async () => {
    const created = await request(app).post('/api/slots').send(valid)
    const id = created.body.id
    const res = await request(app).put(`/api/slots/${id}`).send({ time: '15:30', id: 999 })
    expect(res.status).toBe(200)
    expect(res.body.time).toBe('15:30')
    expect(res.body.doctor).toBe('Dr. Lee')
    expect(res.body.id).toBe(id)
  })

  it('PUT /api/slots/:id returns 404 if not found', async () => {
    const res = await request(app).put('/api/slots/9999').send(valid)
    expect(res.status).toBe(404)
  })

  it('DELETE /api/slots/:id deletes a slot', async () => {
    const created = await request(app).post('/api/slots').send(valid)
    const id = created.body.id
    const res = await request(app).delete(`/api/slots/${id}`)
    expect(res.status).toBe(204)
    const after = await request(app).get(`/api/slots/${id}`)
    expect(after.status).toBe(404)
  })

  it('DELETE /api/slots/:id returns 404 if not found', async () => {
    const res = await request(app).delete('/api/slots/9999')
    expect(res.status).toBe(404)
  })
})
