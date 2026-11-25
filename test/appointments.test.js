import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Appointments API', () => {
  it('GET /api/appointments should return an array', async () => {
    const res = await request(app).get('/api/appointments')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/appointments should create an appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctor: 'Dr. Lee', patient: 'Alice', date: '2026-12-01' })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.doctor).toBe('Dr. Lee')
    expect(res.body.patient).toBe('Alice')
    expect(res.body.date).toBe('2026-12-01')
  })

  it('POST /api/appointments should return 400 when a field is missing', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctor: 'Dr. Lee' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('POST /api/appointments should return 400 when the body is empty', async () => {
    const res = await request(app).post('/api/appointments')
    expect(res.status).toBe(400)
  })

  it('POST /api/appointments should return 400 for an invalid date', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ doctor: 'Dr. Lee', patient: 'Alice', date: '2026-02-31' })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/date/i)
  })

  it('GET /api/appointments/:id should return the appointment', async () => {
    const res = await request(app).get('/api/appointments/1')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id', 1)
  })

  it('GET /api/appointments/:id should return 404 if not found', async () => {
    const res = await request(app).get('/api/appointments/9999')
    expect(res.status).toBe(404)
  })
})
