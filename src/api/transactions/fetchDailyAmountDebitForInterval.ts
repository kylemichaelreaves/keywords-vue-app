import {httpClient} from "@api/httpClient";
import type {DailyInterval} from "@types";

export async function fetchDailyAmountDebitForInterval(interval?: string, startDate?: string) {
    return await httpClient
        .get<Array<DailyInterval>>(`/transactions/get-daily-total-amount-debit`, {
            params: {
                interval,
                startDate
            },
        })
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}
