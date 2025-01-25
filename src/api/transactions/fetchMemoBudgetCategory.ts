import {httpClient} from "@api/httpClient";
import type {Memo, BudgetCategory} from "@types";

// TODO remove: it's redundant. And, remove route from API Gateway.
export async function fetchMemoBudgetCategory(memo: Memo['name']): Promise<BudgetCategory> {
    return await httpClient.get(`/transactions/get-memo-budget-category`, {
        params: {
            memo: memo
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}