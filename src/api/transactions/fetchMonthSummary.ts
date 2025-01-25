import type {MonthSummary} from "@types";
import {httpClient} from "@api/httpClient";

export async function fetchMonthSummary(month: string): Promise<MonthSummary[]> {
    return await httpClient
        .get(`/transactions/get-month-summary`, {
            params: {
                month
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}