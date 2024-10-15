import {fetchMemoBudgetCategory} from "@api/transactions/fetchMemoBudgetCategory";
import {useQuery} from '@tanstack/vue-query';
import type {Memo} from "@types";

export default function useMemoBudgetCategory(memo: Memo) {
    return useQuery({
        queryKey: ['memo-budget-category', memo],
        queryFn: async () => {
            return fetchMemoBudgetCategory(memo)
        },
        refetchOnWindowFocus: false,
    })
}