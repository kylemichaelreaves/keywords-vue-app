import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Memo, BudgetCategory} from "@types";

// TODO remove: it's redundant. And, remove route from API Gateway.
export async function fetchMemoBudgetCategory(memo: Memo['name']): Promise<BudgetCategory> {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-memo-budget-category`, {
        params: {
            memo: memo
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}