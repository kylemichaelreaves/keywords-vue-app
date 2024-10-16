import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Memo, BudgetCategory} from "@types";

// returns a BudgetCategory, or null if it doesn't exist, for a given memo
export async function fetchMemoBudgetCategory(memo: Memo): Promise<BudgetCategory> {
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
        .catch(err => {
            console.log('err:', err);
            throw err;
        });
}