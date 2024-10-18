import {updateMemoBudgetCategory} from "@api/transactions/updateMemoBudgetCategory";
import {useMutation} from "@tanstack/vue-query";

export default function mutateMemoBudgetCategory() {
    return useMutation({
        mutationKey: ['mutate-memo-budget-category'],
        mutationFn: async ({ memo, budgetCategory }: { memo: string, budgetCategory: string }) => {
            return updateMemoBudgetCategory(memo, budgetCategory);
        }
    });
}
