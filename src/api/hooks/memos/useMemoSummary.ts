import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { fetchMemoSummary } from '@api/memos/fetchMemoSummary.ts'
import type { Memo, MemoSummary } from '@types'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export default function useMemoSummary(
  memoId: MaybeRefOrGetter<Memo['id']>,
): UseQueryReturnType<MemoSummary, Error> {
  const memoIdValue = computed(() => toValue(memoId))

  return useQuery({
    queryKey: computed(() => ['memoSummary', memoIdValue.value]),
    queryFn: () => fetchMemoSummary(memoIdValue.value),
    refetchOnWindowFocus: false,
    enabled: computed(() => !!memoIdValue.value),
  })
}
