import {httpClient} from "@api/httpClient";

export async function fetchBudgetCategories() {
    return await httpClient
        .get(`/budget-categories`)
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}