import type {WeekSummary} from "@types";
import {httpClient} from "@api/httpClient";

export async function fetchWeekSummary(week: string): Promise<Array<WeekSummary>> {
    return await httpClient
        .get(`/transactions/get-week-summary`, {
            params: {
                week
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        })


}
