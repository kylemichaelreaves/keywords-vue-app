import { formatDate } from '@api/helpers/formatDate'

describe('formatDate', () => {
  test('formats a valid date string', () => {
    const input = '2023-07-31T01:00:00.000Z'
    const expected = '2023-07-31'
    const result = formatDate(input)
    expect(result).toBe(expected)
  })

  test('handles different date inputs', () => {
    const inputs = [
      { input: '2021-12-25T18:30:00.000Z', expected: '2021-12-25' },
      { input: '2020-02-29T12:00:00.000Z', expected: '2020-02-29' },
      { input: '2010-07-04T04:45:00.000Z', expected: '2010-07-04' },
    ]

    inputs.forEach(({ input, expected }) => {
      const result = formatDate(input)
      expect(result).toBe(expected)
    })
  })

  test('returns "Invalid date" for invalid date strings', () => {
    const invalidInputs = ['invalid', '2021-13-01', '2021-02-34']

    invalidInputs.forEach((input) => {
      const result = formatDate(input)
      expect(result).toBe('Invalid date')
    })
  })
})
