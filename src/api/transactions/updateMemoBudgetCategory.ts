import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {BudgetCategory} from "@types";

// returns a BudgetCategory, or null if it doesn't exist, for a given memo
export async function updateMemoBudgetCategory(memo: string, budgetCategory: string): Promise<BudgetCategory> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.post(`${fetchURL}/transactions/update-memo-budget-category`, {
            memo: memo,
            budgetCategory: budgetCategory
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}