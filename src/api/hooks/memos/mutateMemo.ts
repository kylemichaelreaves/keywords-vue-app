import { useMutation } from '@tanstack/vue-query'
import { updateMemo } from '@api/memos/updateMemo.ts'
import type { Memo } from '@types'

export default function mutateMemo() {
  return useMutation({
    mutationKey: ['mutate-memo'],
    // ensure we're sending back the Memo's ID and the fields we want to update
    mutationFn: async ({ memo }: { memo: Partial<Memo> & { id: number } }) => {
      return updateMemo(memo)
    },
  })
}
