import {httpClient} from "@api/httpClient";

export default async function fetchOldestTransactionDate() {
    // TODO instead of hitting this route, pass query params to transactions route
    return await httpClient
        .get<string>(`/transactions/get-oldest-transaction-date`)
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}
