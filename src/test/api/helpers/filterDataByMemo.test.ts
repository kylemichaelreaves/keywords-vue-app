import type { Transaction } from '@types'
import filterDataByMemo from '@api/helpers/filterDataByMemo'
import { describe, expect, test } from 'vitest'


describe('filterDataByMemo', () => {
  test('filterDataByMemo should return the correct data', () => {
    const data: Transaction[] = [
      {
        id: 1,
        transaction_number: '1',
        date: '2021-05-15',
        description: 'Test Description 1',
        memo_id: 11,
        memo: 'Test Memo 1',
        amount_debit: '100',
        amount_credit: '100',
        balance: '1000',
        check_number: '123',
        fees: '0',
        budget_category: 'Test Category'
      },
      {
        id: 2,
        transaction_number: '2',
        date: '2021-05-15',
        description: 'Test Description 2',
        memo_id: 12,
        memo: 'Test Memo 2',
        amount_debit: '200',
        amount_credit: '200',
        balance: '2000',
        check_number: '456',
        fees: '0',
        budget_category: 'Test Category'
      },
      {
        id: 3,
        transaction_number: '3',
        date: '2021-05-15',
        description: 'Test Description 3',
        memo_id: 13,
        memo: 'Test Memo 1',
        amount_debit: '300',
        amount_credit: '300',
        balance: '3000',
        check_number: '789',
        fees: '0',
        budget_category: 'Test Category'
      }
    ]
    const selectedMemo = 'Test Memo 1'
    const result = filterDataByMemo(data, selectedMemo)
    expect(result).toEqual([
      {
        id: 1,
        transaction_number: '1',
        date: '2021-05-15',
        description: 'Test Description 1',
        memo_id: 11,
        memo: 'Test Memo 1',
        amount_debit: '100',
        amount_credit: '100',
        balance: '1000',
        check_number: '123',
        fees: '0',
        budget_category: 'Test Category'
      },
      {
        id: 3,
        transaction_number: '3',
        date: '2021-05-15',
        description: 'Test Description 3',
        memo_id: 13,
        memo: 'Test Memo 1',
        amount_debit: '300',
        amount_credit: '300',
        balance: '3000',
        check_number: '789',
        fees: '0',
        budget_category: 'Test Category'
      }
    ])
  })

  test('filterDataByMemo should return all data if no memo is selected', () => {
    const data: Transaction[] = [
      {
        id: 1,
        transaction_number: '1',
        date: '2021-05-15',
        description: 'Test Description 1',
        memo_id: 11,
        memo: 'Test Memo 1',
        amount_debit: '100',
        amount_credit: '100',
        balance: '1000',
        check_number: '123',
        fees: '0',
        budget_category: 'Test Category'
      },
      {
        id: 2,
        transaction_number: '2',
        date: '2021-05-15',
        description: 'Test Description 2',
        memo: 'Test Memo 2',
        memo_id: 12,
        amount_debit: '200',
        amount_credit: '200',
        balance: '2000',
        check_number: '456',
        fees: '0',
        budget_category: 'Test Category'
      },
      {
        id: 3,
        transaction_number: '3',
        date: '2021-05-15',
        description: 'Test Description 3',
        memo_id: 13,
        memo: 'Test Memo 1',
        amount_debit: '300',
        amount_credit: '300',
        balance: '3000',
        check_number: '789',
        fees: '0',
        budget_category: 'Test Category'
      }
    ]
    const selectedMemo = 'Test Memo 2'

    const result = filterDataByMemo(data, selectedMemo)
    expect(result).toEqual([
      {
        id: 2,
        transaction_number: '2',
        date: '2021-05-15',
        description: 'Test Description 2',
        memo: 'Test Memo 2',
        memo_id: 12,
        amount_debit: '200',
        amount_credit: '200',
        balance: '2000',
        check_number: '456',
        fees: '0',
        budget_category: 'Test Category'
      }
    ])
  })
})
