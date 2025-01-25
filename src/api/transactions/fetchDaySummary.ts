import type {DaySummary} from "@types";
import {httpClient} from "@api/httpClient";

export async function fetchDaySummary(day: string): Promise<DaySummary[]> {
    return await httpClient
        .get(`/transactions/get-day-summary`, {
            params: {
                day
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}