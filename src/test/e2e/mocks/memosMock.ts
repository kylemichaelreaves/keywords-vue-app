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

  // Cryptographically secure random number generator to satisfy SonarQube security requirements
  function secureRandom(): number {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] / (0xffffffff + 1)
  }

  // Secure random integer between 0 and max (exclusive)
  function secureRandomInt(max: number): number {
    return Math.floor(secureRandom() * max)
  }

  // Secure random boolean with given probability (0-1)
  function secureRandomBoolean(probability: number = 0.5): boolean {
    return secureRandom() < probability
  }

  for (let i = 0; i < count; i++) {
    // Randomly select memo name (with some duplicates allowed for realism)
    const name = memoNames[secureRandomInt(memoNames.length)]

    // Generate realistic boolean distributions using secure random
    const recurring = secureRandomBoolean(0.4) // 40% chance of being recurring
    const necessary = secureRandomBoolean(0.4) // 40% chance of being necessary
    const ambiguous = secureRandomBoolean(0.1) // 1% chance of being ambiguous

    // Select frequency (bias towards monthly for recurring items)
    let frequency: Frequency
    if (recurring) {
      const recurringFreqs: Frequency[] = ['daily', 'weekly', 'monthly', 'yearly']
      frequency = recurringFreqs[secureRandomInt(recurringFreqs.length)]
    } else {
      // For non-recurring items, use a weighted selection
      const frequencyOptions: Frequency[] = ['weekly', 'weekly', 'monthly', 'monthly', 'monthly', 'yearly']
      frequency = frequencyOptions[secureRandomInt(frequencyOptions.length)]
    }

    memos.push({
      id: i + 1,
      name: name,
      recurring: recurring,
      necessary: necessary,
      frequency: frequency,
      budget_category: budgetCategories[secureRandomInt(budgetCategories.length)],
      ambiguous: ambiguous
    })
  }

  return memos
}