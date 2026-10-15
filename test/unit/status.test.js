/**
 * Unit tests for src/utils/status.js.
 * Covers all branches for good branch coverage.
 */
import { describe, it, expect } from 'vitest'
import { formatStatus } from '../../src/utils/status.js'

describe('formatStatus', () => {
  it('throws on negative', () => {
    expect(() => formatStatus(-1)).toThrow('invalid uptime')
  })
  it('warming-up under 60s', () => {
    expect(formatStatus(10)).toBe('warming-up')
  })
  it('healthy under 1h', () => {
    expect(formatStatus(3599)).toBe('healthy')
  })
  it('steady at or after 1h', () => {
    expect(formatStatus(3600)).toBe('steady')
  })
})

describe('formatStatus - invalid inputs', () => {
  it.each([['abc'], [NaN], [undefined], [null]])(
    'throws on non-numeric value %p',
    (value) => {
      expect(() => formatStatus(value)).toThrow('invalid uptime')
    }
  )
})

describe('formatStatus - boundaries', () => {
  it.each([
    [0, 'warming-up'],
    [59, 'warming-up'],
    [60, 'healthy'],
    [3599, 'healthy'],
    [3600, 'steady']
  ])('formatStatus(%p) returns %p', (input, expected) => {
    expect(formatStatus(input)).toBe(expected)
  })
})
