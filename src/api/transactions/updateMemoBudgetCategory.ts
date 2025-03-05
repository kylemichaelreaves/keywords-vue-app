import { httpClient } from '@api/httpClient'
import type { BudgetCategory, Memo } from '@types'

// TODO give budgetCategory a type, any field of the BudgetCategories Object
export async function updateMemoBudgetCategory(memo: Memo['name'], budgetCategory: string): Promise<BudgetCategory> {
  // TODO remove: it's redundant. And, remove route from API Gateway.
  return await httpClient
    .patch(`/transactions/update-memo-budget-category`, {
        memo: memo,
        budgetCategory: budgetCategory
      }
    )
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}