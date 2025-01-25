import {httpClient} from "@api/httpClient";

export async function fetchDescriptions(): Promise<Array<string>> {
    return await httpClient
        .get(`/transactions/descriptions`)
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}