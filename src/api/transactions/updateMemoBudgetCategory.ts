import { httpClient } from '@api/httpClient'
import type { Memo } from '@types'

export async function updateMemoBudgetCategory(memoName: Memo['name'], budgetCategory: string): Promise<Memo> {
  // TODO remove: it's redundant.
  try {
    const res = await httpClient.patch(`/memos/${memoName}`, {
        budgetCategory: budgetCategory
      }
    )
    return res.data
  } catch (err) {
    console.error('Error updating memo budget category:', { memoName, budgetCategory }, err)
    throw err
  }
}