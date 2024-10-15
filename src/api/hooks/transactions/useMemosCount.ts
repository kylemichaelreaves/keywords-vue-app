import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from '@tanstack/vue-query'
import {fetchMemosCount} from '@api/transactions/fetchMemosCount'

export default function useMemosCount(): UseQueryReturnType<number, Error> {
    return useQuery<number>({
        queryKey: ['memosCount'],
        queryFn: async () => {
            return fetchMemosCount();
        },
        refetchOnWindowFocus: false
    })
}