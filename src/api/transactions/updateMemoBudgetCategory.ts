import { httpClient } from '@api/httpClient'
import type { Memo } from '@types'

export async function updateMemoBudgetCategory(memo: Memo['name'], budgetCategory: string): Promise<Memo> {
  // TODO remove: it's redundant.
  return await httpClient
    .patch(`/memos/${memo}`, {
        budgetCategory: budgetCategory
      }
    )
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}