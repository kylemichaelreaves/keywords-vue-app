import type {OFSummaryTypeBase} from "@types";
import {httpClient} from "@api/httpClient";

// TODO instead of a path, pass query params to transactions route, budgetCategory
export async function fetchOFAmountDebit(timeFrame: string, date?: Date | null | undefined): Promise<OFSummaryTypeBase> {
    return await httpClient
        .get(`/transactions/get-of-amount-debit`, {
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