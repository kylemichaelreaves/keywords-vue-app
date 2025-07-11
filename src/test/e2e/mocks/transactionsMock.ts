import type { Transaction } from '@types'
import { faker } from '@faker-js/faker'


// Function to generate a single transaction
function generateTransaction(memo?:string): Transaction {
  const isDebit = faker.datatype.boolean()
  const amount = faker.finance.amount({ min: 1, max: 5000, dec: 2 })

  return {
    id: faker.number.int({ min: 1, max: 100000 }),
    transaction_number: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
    description: faker.finance.transactionDescription(),
    memo: memo ?? faker.lorem.sentence({ min: 3, max: 8 }),
    memo_id: faker.number.int({ min: 1, max: 1000 }),
    amount_debit: isDebit ? amount : '0.00',
    amount_credit: isDebit ? '0.00' : amount,
    balance: faker.finance.amount({ min: 0, max: 25000, dec: 2 }),
    check_number: faker.datatype.boolean() ? faker.number.int({ min: 1001, max: 9999 }).toString() : undefined,
    fees: faker.datatype.boolean() ? faker.finance.amount({ min: 0, max: 50, dec: 2 }) : undefined,
    budget_category: faker.helpers.arrayElement([
      'Food & Dining',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Auto & Transport',
      'Travel',
      'Health & Fitness',
      'Income',
      'Transfer',
      'Business Services'
    ])
  }
}

// Generate an array of transactions
export function generateTransactionsArray(count: number, memo?: string): Transaction[] {
  return Array.from({ length: count }, () => generateTransaction(memo))
}
