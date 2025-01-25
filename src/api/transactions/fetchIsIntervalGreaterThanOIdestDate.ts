import {httpClient} from "@api/httpClient";

export async function fetchIsIntervalGreaterThanOldestDate(interval: string): Promise<boolean> {
    return await httpClient
        .get(`/transactions/is-interval-greater-than-oldest-date`, {
            params: {
                interval
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}