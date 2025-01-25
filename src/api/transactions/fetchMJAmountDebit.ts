import type {MJSummary} from "@types";
import {httpClient} from "@api/httpClient";

export async function fetchMJAmountDebit(timeFrame: string, date?: Date | null | undefined): Promise<MJSummary> {
    // TODO instead of a path, pass query params to transactions route, budgetCategory
    return await httpClient
        .get(`/transactions/get-mj-amount-debit`, {
            params: {
                timeFrame: timeFrame,
                date: date ? date?.toISOString().split('T')[0] : null
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}