import { describe, expect, it } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { extractApiErrorMessage } from '@api/extractApiErrorMessage'

function makeAxiosError(status: number, data?: unknown): AxiosError {
  const headers = new AxiosHeaders()
  const config = { headers }
  return new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, null, {
    status,
    statusText: 'Error',
    headers: {},
    config,
    data,
  })
}

describe('extractApiErrorMessage', () => {
  it('returns server message from an Axios error response', () => {
    const error = makeAxiosError(400, { message: 'Invalid email address' })
    expect(extractApiErrorMessage(error)).toBe('Invalid email address')
  })

  it('falls back to error.message when response.data.message is missing', () => {
    const error = makeAxiosError(500, { detail: 'something else' })
    expect(extractApiErrorMessage(error)).toBe('Request failed')
  })

  it('falls back to error.message when response.data.message is empty', () => {
    const error = makeAxiosError(422, { message: '' })
    expect(extractApiErrorMessage(error)).toBe('Request failed')
  })

  it('handles an Axios error with no response at all', () => {
    const error = new AxiosError('Network Error')
    expect(extractApiErrorMessage(error)).toBe('Network Error')
  })

  it('handles a plain Error', () => {
    expect(extractApiErrorMessage(new Error('something broke'))).toBe('something broke')
  })

  it('handles a TypeError', () => {
    expect(extractApiErrorMessage(new TypeError('x is not a function'))).toBe(
      'x is not a function',
    )
  })

  it.each([
    ['string', 'oops'],
    ['null', null],
    ['undefined', undefined],
    ['number', 42],
    ['object', { foo: 'bar' }],
  ])('returns generic message for non-Error value: %s', (_label, value) => {
    expect(extractApiErrorMessage(value)).toBe('An unexpected error occurred')
  })
})
