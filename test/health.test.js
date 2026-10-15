/**
    * Integration tests for base routes defined in src/app.js.
    */
import request from 'supertest'
import app from '../src/app.js'
import { describe, it, expect } from 'vitest'

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.text).toBe('OK')
  })
})

describe('GET /', () => {
  it('returns the JSON greeting', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})

describe('unknown route', () => {
  it('returns 404', async () => {
    const res = await request(app).get('/does-not-exist')
    expect(res.status).toBe(404)
  })
})
