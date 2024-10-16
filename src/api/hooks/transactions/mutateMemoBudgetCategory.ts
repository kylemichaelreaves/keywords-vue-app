import {useMutation} from '@tanstack/vue-query';
import type {BudgetCategory, Memo} from "@types";
import {updateMemoBudgetCategory} from "@api/transactions/updateMemoBudgetCategory";

export default function mutateMemoBudgetCategory(memo: Memo, budgetCategory: BudgetCategory) {
    return useMutation({
        mutationKey: ['memo-budget-category', memo, budgetCategory],
        mutationFn: async () => {
            return updateMemoBudgetCategory(memo, budgetCategory)
        },
    })
}