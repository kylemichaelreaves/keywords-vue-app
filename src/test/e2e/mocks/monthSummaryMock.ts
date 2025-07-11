/**
 * Generates an array of memo/debit amount objects for testing
 * @param {number} count - Number of objects to generate
 * @returns {Array} Array of objects with memo and total_amount_debit properties
 */
export function generateMonthSummaryArray(count = 75) {
  const memos = [];

  const memoDescriptions = [
    'ATM Withdrawal', 'Grocery Store Purchase', 'Gas Station', 'Restaurant Dining',
    'Online Purchase', 'Coffee Shop', 'Pharmacy', 'Department Store',
    'Utility Payment', 'Insurance Payment', 'Subscription Service', 'Car Maintenance',
    'Medical Expense', 'Home Improvement', 'Entertainment', 'Transportation',
    'Mobile Payment', 'Bank Transfer', 'Credit Card Payment', 'Shopping Center',
    'Fuel Purchase', 'Food Delivery', 'Streaming Service', 'Gym Membership',
    'Professional Services', 'Education Expense', 'Travel Expense', 'Pet Care'
  ];

  for (let i = 0; i < count; i++) {
    // Randomly select memo description
    const memo = memoDescriptions[Math.floor(Math.random() * memoDescriptions.length)];

    // Generate realistic debit amounts
    // Most transactions are small ($5-$100), some medium ($100-$500), few large ($500-$2000)
    let amount;
    const rand = Math.random();

    if (rand < 0.6) {
      // 60% small transactions ($5-$100)
      amount = Math.random() * 95 + 5;
    } else if (rand < 0.9) {
      // 30% medium transactions ($100-$500)
      amount = Math.random() * 400 + 100;
    } else {
      // 10% large transactions ($500-$2000)
      amount = Math.random() * 1500 + 500;
    }

    // Round to 2 decimal places
    amount = Math.round(amount * 100) / 100;

    memos.push({
      memo: memo,
      total_amount_debit: amount
    });
  }

  return memos;
}