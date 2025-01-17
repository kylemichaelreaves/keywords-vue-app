import {fetchMemoBudgetCategory} from "@api/transactions/fetchMemoBudgetCategory";
import {useQuery} from '@tanstack/vue-query';
import type {Memo} from "@types";

export default function useMemoBudgetCategory(memoName: Memo['name']) {
    return useQuery({
        queryKey: ['memo-budget-category', memoName],
        queryFn: () => fetchMemoBudgetCategory(memoName),
        refetchOnWindowFocus: false,
    })
}