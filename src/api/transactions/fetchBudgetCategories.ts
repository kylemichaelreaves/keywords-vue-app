import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";

export async function fetchBudgetCategories() {
    const fetchURL = import.meta.env.VITE_APIGATEWAY_URL;

    if (!isValidURL(fetchURL)) {
        throw Error('url is not valid');
    }

    return await axios.get(`${fetchURL}/transactions/get-budget-categories`)
        .then(res => res.data)
        .catch(err => {
            console.log('err:', err);
            throw err;
        });

}