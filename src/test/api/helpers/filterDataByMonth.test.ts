import type { Transaction } from '@types'
import { filterDataByMonth } from '@api/helpers/filterDataByMonth'
import { describe, expect, it } from 'vitest'

describe('filterDataByMonth', () => {
  const testData: Transaction[] = [
    { transaction_number: '0001', date: '01/01/2022', memo: 'test', amount_debit: '10.00' },
    { transaction_number: '0002', date: '01/01/2022', memo: 'test', amount_debit: '20.00' },
    { transaction_number: '0003', date: '02/01/2022', memo: 'test', amount_debit: '30.00' },
    { transaction_number: '0004', date: '03/01/2022', memo: 'test', amount_debit: '40.00' }
  ]

  it('returns filtered data for a selected month', () => {
    const result = filterDataByMonth(testData, '01/2022')
    expect(result).toHaveLength(2)
    expect(result[0].date).toBe('01/01/2022')
  })

  it('returns all data when no month is selected', () => {
    const result = filterDataByMonth(testData, '')
    expect(result).toHaveLength(testData.length)
  })
})
