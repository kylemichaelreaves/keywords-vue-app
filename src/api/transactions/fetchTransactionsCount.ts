import {httpClient} from "@api/httpClient";

export async function fetchTransactionsCount(timeFrame?: string | undefined, date?: Date | null | undefined | string) {
    // TODO timeFrame should be optional — if there's no timeframe, it returns the total number of transactions
    // TODO refactor away from this route to passing query params to transactions route, totalTransactionsCount
    return await httpClient
        .get(`/transactions/get-transactions-count`, {
            params: {
                timeFrame: timeFrame,
                date: date
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}