import type { Frequency } from '@types'

/**
 * Generates an array of mock Memo objects for testing
 * @param {number} count - Number of memos to generate
 * @returns {Array} Array of Memo objects
 */
export function generateMemosArray(count = 100) {
  const memos = []

  // Sample data for realistic memos
  const memoNames = [
    'Rent Payment', 'Groceries', 'Internet Bill', 'Phone Bill', 'Car Insurance',
    'Gym Membership', 'Netflix Subscription', 'Coffee Shop', 'Gas Station',
    'Electric Bill', 'Water Bill', 'Restaurant Dinner', 'Amazon Purchase',
    'Target Shopping', 'Pharmacy', 'Doctor Visit', 'Car Maintenance',
    'Hair Salon', 'Movie Theater', 'Book Store', 'Clothing Store',
    'Home Depot', 'Bank Transfer', 'Credit Card Payment', 'Student Loan'
  ]

  const budgetCategories = [
    'Housing', 'Food', 'Transportation', 'Utilities', 'Healthcare',
    'Entertainment', 'Shopping', 'Personal Care', 'Education', 'Insurance',
    'Savings', 'Debt Payment', 'Miscellaneous'
  ]

  for (let i = 0; i < count; i++) {
    // Randomly select memo name (with some duplicates allowed for realism)
    const name = memoNames[Math.floor(Math.random() * memoNames.length)]

    // Generate realistic boolean distributions
    const recurring = Math.random() < 0.6 // 60% chance of being recurring
    const necessary = Math.random() < 0.7 // 70% chance of being necessary
    const ambiguous = Math.random() < 0.2 // 20% chance of being ambiguous

    // Select frequency (bias towards monthly for recurring items)
    let frequency: Frequency
    if (recurring) {
      const recurringFreqs: Frequency[] = ['daily', 'weekly', 'monthly', 'yearly']
      frequency = recurringFreqs[Math.floor(Math.random() * recurringFreqs.length)]
    } else {
      frequency = Math.random() < 0.8 ? 'weekly' : 'monthly'
    }

    memos.push({
      id: i + 1,
      name: name,
      recurring: recurring,
      necessary: necessary,
      frequency: frequency,
      budget_category: budgetCategories[Math.floor(Math.random() * budgetCategories.length)],
      ambiguous: ambiguous
    })
  }

  return memos
}