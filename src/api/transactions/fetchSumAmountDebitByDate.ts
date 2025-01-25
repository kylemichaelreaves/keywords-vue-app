import {httpClient} from "@api/httpClient";

export async function fetchSumAmountDebitByDate(timeFrame: string, date: Date | null | undefined) {
    return await httpClient.get(`/transactions/get-sum-amount-debit-by-date`, {
        params: {
            timeFrame,
            date: date?.toISOString().split('T')[0]
        }
    })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });

}