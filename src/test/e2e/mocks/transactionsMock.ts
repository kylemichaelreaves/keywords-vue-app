import type { Transaction } from '@types'
import { faker } from '@faker-js/faker'


// Function to generate a single transaction
function generateTransaction(memo?: string, date?: string): Transaction {
  const isDebit = faker.datatype.boolean()
  const amount = faker.finance.amount({ min: 1, max: 5000, dec: 2 })

  return {
    id: faker.number.int({ min: 1, max: 100000 }),
    transaction_number: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
    date: date ?? faker.date.past({ years: 1 }).toISOString(),
    description: faker.finance.transactionDescription(),
    memo: memo && memo.trim() !== '' ? memo : faker.lorem.sentence({ min: 3, max: 8 }),
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
export function generateTransactionsArray(count: number, memo?: string, date?: string): Transaction[] {
  return Array.from({ length: count }, () => generateTransaction(memo, date))
}


export const staticTransactions: Transaction[] = [
  {
    id: 1,
    transaction_number: 'ABCD1234',
    date: '2023-06-01T00:00:00.000Z',
    description: 'Grocery Store',
    memo: 'Weekly groceries',
    memo_id: 101,
    amount_debit: '150.00',
    amount_credit: '0.00',
    balance: '8500.00',
    check_number: '1001',
    fees: '2.50',
    budget_category: 'Food & Dining'
  },
  {
    id: 2,
    transaction_number: 'EFGH5678',
    date: '2023-06-02T00:00:00.000Z',
    description: 'Online Shopping',
    memo: 'Clothes purchase',
    memo_id: 102,
    amount_debit: '-200.00',
    amount_credit: '0.00',
    balance: '8300.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Shopping'
  },
  {
    id: 3,
    transaction_number: 'IJKL9012',
    date: '2023-06-03T00:00:00.000Z',
    description: 'Salary Payment',
    memo: 'Monthly salary',
    memo_id: 103,
    amount_debit: '0.00',
    amount_credit: '3000.00',
    balance: '11300.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Income'
  },
  {
    id: 4,
    transaction_number: 'MNOP3456',
    date: '2023-06-04T00:00:00.000Z',
    description: 'Utility Bill',
    memo: 'Electricity bill for May',
    memo_id: 104,
    amount_debit: '-120.00',
    amount_credit: '0.00',
    balance: '11180.00',
    check_number: '1002',
    fees: '1.50',
    budget_category: 'Bills & Utilities'
  },
  {
    id: 5,
    transaction_number: 'QRST7890',
    date: '2023-06-05T00:00:00.000Z',
    description: 'Restaurant Dinner',
    memo: 'Dinner with friends',
    memo_id: 105,
    amount_debit: '-80.00',
    amount_credit: '0.00',
    balance: '11100.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Food & Dining'
  },
  {
    id: 6,
    transaction_number: 'UVWX1234',
    date: '2023-06-06T00:00:00.000Z',
    description: 'Gas Station',
    memo: 'Fuel for car',
    memo_id: 106,
    amount_debit: '-50.00',
    amount_credit: '0.00',
    balance: '11050.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Auto & Transport'
  },
  {
    id: 7,
    transaction_number: 'YZAB5678',
    date: '2023-06-07T00:00:00.000Z',
    description: 'Movie Tickets',
    memo: 'Cinema outing',
    memo_id: 107,
    amount_debit: '-30.00',
    amount_credit: '0.00',
    balance: '11020.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Entertainment'
  },
  {
    id: 8,
    transaction_number: 'CDEF9012',
    date: '2023-06-08T00:00:00.000Z',
    description: 'Book Purchase',
    memo: 'New novel',
    memo_id: 108,
    amount_debit: '-15.00',
    amount_credit: '0.00',
    balance: '11005.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Shopping'
  },
  {
    id: 9,
    transaction_number: 'GHIK3456',
    date: '2023-06-09T00:00:00.000Z',
    description: 'Gym Membership',
    memo: 'Monthly fee',
    memo_id: 109,
    amount_debit: '-40.00',
    amount_credit: '0.00',
    balance: '10965.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Health & Fitness'
  },
  {
    id: 10,
    transaction_number: 'LMNO7890',
    date: '2023-06-10T00:00:00.000Z',
    description: 'Transfer to Savings',
    memo: 'Monthly savings transfer',
    memo_id: 110,
    amount_debit: '-500.00',
    amount_credit: '0.00',
    balance: '10465.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Transfer'
  },
  {
    id: 11,
    transaction_number: 'PQRS1234',
    date: '2023-06-11T00:00:00.000Z',
    description: 'Business Services',
    memo: 'Consulting fee',
    memo_id: 111,
    amount_debit: '0.00',
    amount_credit: '1000.00',
    balance: '11465.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Business Services'
  },
  {
    id: 12,
    transaction_number: 'TUVW5678',
    date: '2023-06-11T00:00:00.000Z',
    description: 'Online Subscription',
    memo: 'Monthly software subscription',
    memo_id: 112,
    amount_debit: '-15.00',
    amount_credit: '0.00',
    balance: '11450.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Entertainment'
  },
  {
    id: 13,
    transaction_number: 'XYZ12345',
    date: '2023-06-12T00:00:00.000Z',
    description: 'Coffee Shop',
    memo: 'Morning coffee',
    memo_id: 113,
    amount_debit: '-5.00',
    amount_credit: '0.00',
    balance: '11445.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Food & Dining'
  },
  {
    id: 14,
    transaction_number: 'ABC67890',
    date: '2023-06-13T00:00:00.000Z',
    description: 'Bookstore Purchase',
    memo: 'Educational books',
    memo_id: 114,
    amount_debit: '-60.00',
    amount_credit: '0.00',
    balance: '11385.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Shopping'
  },
  {
    id: 15,
    transaction_number: 'DEF23456',
    date: '2023-06-13T00:00:00.000Z',
    description: 'Restaurant Lunch',
    memo: 'Business lunch meeting',
    memo_id: 115,
    amount_debit: '-75.00',
    amount_credit: '0.00',
    balance: '11310.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Food & Dining'
  },
  {
    id: 16,
    transaction_number: 'GHI78901',
    date: '2023-06-14T00:00:00.000Z',
    description: 'Car Maintenance',
    memo: 'Oil change and service',
    memo_id: 116,
    amount_debit: '-120.00',
    amount_credit: '0.00',
    balance: '11290.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Auto & Transport'
  },
  {
    id: 17,
    transaction_number: 'JKL34567',
    date: '2023-06-15T00:00:00.000Z',
    description: 'Movie Streaming Service',
    memo: 'Monthly subscription',
    memo_id: 117,
    amount_debit: '-10.00',
    amount_credit: '0.00',
    balance: '11280.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Entertainment'
  },
  {
    id: 18,
    transaction_number: 'MNO89012',
    date: '2023-06-16T00:00:00.000Z',
    description: 'Health Insurance Payment',
    memo: 'Monthly premium',
    memo_id: 118,
    amount_debit: '-200.00',
    amount_credit: '0.00',
    balance: '11080.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Health & Fitness'
  },
  {
    id: 19,
    transaction_number: 'PQR45678',
    date: '2023-06-17T00:00:00.000Z',
    description: 'Transfer to Investment Account',
    memo: 'Monthly investment transfer',
    memo_id: 119,
    amount_debit: '-300.00',
    amount_credit: '0.00',
    balance: '10780.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Transfer'
  },
  {
    id: 20,
    transaction_number: 'STU12345',
    date: '2023-06-18T00:00:00.000Z',
    description: 'Freelance Project Payment',
    memo: 'Payment for freelance work',
    memo_id: 120,
    amount_debit: '0.00',
    amount_credit: '1500.00',
    balance: '12280.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Business Services'
  },
  {
    id: 21,
    transaction_number: 'VWX67890',
    date: '2023-06-19T00:00:00.000Z',
    description: 'Online Course Purchase',
    memo: 'E-learning course fee',
    memo_id: 121,
    amount_debit: '-200.00',
    amount_credit: '0.00',
    balance: '12080.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Education'
  },
  {
    id: 22,
    transaction_number: 'YZA23456',
    date: '2023-06-20T00:00:00.000Z',
    description: 'Pet Care Expenses',
    memo: 'Vet visit and supplies',
    memo_id: 122,
    amount_debit: '-80.00',
    amount_credit: '0.00',
    balance: '12000.00',
    check_number: undefined,
    fees: undefined,
    budget_category: 'Pets'
  }


]