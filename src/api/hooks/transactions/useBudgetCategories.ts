import {useQuery} from "@tanstack/vue-query";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchBudgetCategories} from "@api/transactions/fetchBudgetCategories";

export const useBudgetCategories = (): UseQueryReturnType<string[], Error> => {
    return useQuery({
        queryKey: ['budgetCategories'],
        queryFn: () => fetchBudgetCategories(),
        refetchOnWindowFocus: false,
    })
}