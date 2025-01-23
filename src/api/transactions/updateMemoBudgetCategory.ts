import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {BudgetCategory, Memo} from "@types";

// TODO remove: it's redundant. And, remove route from API Gateway.
export async function updateMemoBudgetCategory(memo: Memo['name'], budgetCategory: string): Promise<BudgetCategory> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.patch(`${fetchURL}/transactions/update-memo-budget-category`, {
            memo: memo,
            budgetCategory: budgetCategory
        },
    )
        .then(res => res.data)
        .catch(err => {
            console.error('err:', err);
            throw err;
        });
}