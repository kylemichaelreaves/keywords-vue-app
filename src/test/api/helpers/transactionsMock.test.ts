import { beforeEach, describe, expect, test } from 'vitest'
import { faker } from '@faker-js/faker'
import { generateTransactionsArray } from '@test/e2e/mocks/transactionsMock.ts'

describe('Transaction Generator', () => {
  beforeEach(() => {
    // Set a seed for consistent testing
    faker.seed(123)
  })

  describe('generateTransactionsArray', () => {
    test('should generate the correct number of transactions', () => {
      const count = 5
      const transactions = generateTransactionsArray(count)

      expect(transactions).toHaveLength(count)
    })

    test('should generate transactions with all required fields', () => {
      const transactions = generateTransactionsArray(1)
      const transaction = transactions[0]

      expect(transaction).toHaveProperty('id')
      expect(transaction).toHaveProperty('transaction_number')
      expect(transaction).toHaveProperty('date')
      expect(transaction).toHaveProperty('description')
      expect(transaction).toHaveProperty('memo')
      expect(transaction).toHaveProperty('memo_id')
      expect(transaction).toHaveProperty('amount_debit')
      expect(transaction).toHaveProperty('amount_credit')
      expect(transaction).toHaveProperty('balance')
      expect(transaction).toHaveProperty('budget_category')
    })

    test('should generate valid transaction structure', () => {
      const transactions = generateTransactionsArray(1)
      const transaction = transactions[0]

      // Ensure we have a transaction
      expect(transaction).toBeDefined()

      // ID should be a number within range
      expect(transaction!.id).toBeGreaterThanOrEqual(1)
      expect(transaction!.id).toBeLessThanOrEqual(100000)

      // Transaction number should be 8 character alphanumeric uppercase
      expect(transaction!.transaction_number).toMatch(/^[A-Z0-9]{8}$/)

      // Date should be a valid ISO string
      expect(() => new Date(transaction!.date)).not.toThrow()

      // Amounts should be valid number strings
      expect(transaction!.amount_debit).toMatch(/^\d+\.\d{2}$/)
      expect(transaction!.amount_credit).toMatch(/^\d+\.\d{2}$/)
      expect(transaction!.balance).toMatch(/^\d+\.\d{2}$/)

      // One amount should be 0.00, the other should be > 0
      const debitAmount = parseFloat(transaction!.amount_debit)
      const creditAmount = parseFloat(transaction!.amount_credit)
      expect(debitAmount === 0 || creditAmount === 0).toBe(true)
      expect(debitAmount > 0 || creditAmount > 0).toBe(true)

      // Budget category should be from the predefined list
      const validCategories = [
        'Food & Dining',
        'Shopping',
        'Entertainment',
        'Bills & Utilities',
        'Auto & Transport',
        'Travel',
        'Health & Fitness',
        'Income',
        'Transfer',
        'Business Services',
      ]
      expect(validCategories).toContain(transaction!.budget_category)
    })

    describe('memo handling', () => {
      test('should use provided memo when valid', () => {
        const customMemo = 'Custom transaction memo'
        const transactions = generateTransactionsArray(1, customMemo)

        expect(transactions).toHaveLength(1)
        expect(transactions[0]!.memo).toBe(customMemo)
      })

      test('should use faker when memo is undefined', () => {
        const transactions = generateTransactionsArray(1)

        expect(transactions).toHaveLength(1)
        expect(transactions[0]!.memo).toBeTruthy()
        expect(typeof transactions[0]!.memo).toBe('string')
        expect(transactions[0]!.memo.length).toBeGreaterThan(0)
      })

      test('should use faker when memo is empty string', () => {
        const transactions = generateTransactionsArray(1, '')

        expect(transactions).toHaveLength(1)
        expect(transactions[0]!.memo).toBeTruthy()
        expect(transactions[0]!.memo).not.toBe('')
      })

      test('should use faker when memo is only whitespace', () => {
        const transactions = generateTransactionsArray(1, '   ')

        expect(transactions).toHaveLength(1)
        expect(transactions[0]!.memo).toBeTruthy()
        expect(transactions[0]!.memo.trim()).not.toBe('')
      })

      test('should preserve memo with actual content', () => {
        const memoWithSpaces = '  Valid memo  '
        const transactions = generateTransactionsArray(1, memoWithSpaces)

        expect(transactions).toHaveLength(1)
        expect(transactions[0]!.memo).toBe(memoWithSpaces)
      })
    })

    describe('date handling', () => {
      test('should use provided date when specified', () => {
        const customDate = '2024-01-15T10:30:00Z'
        const transactions = generateTransactionsArray(1, undefined, customDate)

        expect(transactions).toHaveLength(1)
        expect(transactions[0]!.date).toBe(customDate)
      })

      test('should use faker date when date is undefined', () => {
        const transactions = generateTransactionsArray(1)

        expect(transactions).toHaveLength(1)
        expect(transactions[0]!.date).toBeTruthy()
        expect(() => new Date(transactions[0]!.date)).not.toThrow()
      })
    })

    describe('optional fields', () => {
      test('check_number should be either undefined or a valid check number', () => {
        const transactions = generateTransactionsArray(10)

        transactions.forEach((transaction) => {
          if (transaction.check_number !== undefined) {
            expect(transaction.check_number).toMatch(/^\d{4}$/)
            const checkNum = parseInt(transaction.check_number)
            expect(checkNum).toBeGreaterThanOrEqual(1001)
            expect(checkNum).toBeLessThanOrEqual(9999)
          }
        })
      })

      test('fees should be either undefined or a valid amount', () => {
        const transactions = generateTransactionsArray(10)

        transactions.forEach((transaction) => {
          if (transaction.fees !== undefined) {
            expect(transaction.fees).toMatch(/^\d+\.\d{2}$/)
            const feeAmount = parseFloat(transaction.fees)
            expect(feeAmount).toBeGreaterThanOrEqual(0)
            expect(feeAmount).toBeLessThanOrEqual(50)
          }
        })
      })
    })

    test('should generate unique transactions', () => {
      const transactions = generateTransactionsArray(5)
      const ids = transactions.map((t) => t.id)
      const transactionNumbers = transactions.map((t) => t.transaction_number)

      // While not guaranteed due to randomness, very unlikely to have duplicates
      expect(new Set(ids).size).toBeGreaterThan(1)
      expect(new Set(transactionNumbers).size).toBeGreaterThan(1)
    })

    test('should handle edge cases', () => {
      // Zero transactions
      expect(generateTransactionsArray(0)).toHaveLength(0)

      // Single transaction
      expect(generateTransactionsArray(1)).toHaveLength(1)

      // Large number of transactions
      expect(generateTransactionsArray(100)).toHaveLength(100)
    })
  })
})
