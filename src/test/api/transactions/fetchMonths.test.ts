import { fetchMonths } from '@api/timeUnits/months/fetchMonths.ts'
import { vi, test } from 'vitest'
import { monthsMock } from '@mocks/transaction/'
import { createPinia, setActivePinia } from 'pinia'

describe('fetchMonths', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('fetchMonths without date parameter returns all months', async () => {
    const months = await fetchMonths()
    expect(months).toEqual(monthsMock)
  })
})
