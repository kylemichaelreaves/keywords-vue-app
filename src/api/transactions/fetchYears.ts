import {httpClient} from "@api/httpClient";
import type {Year} from "@types";

export async function fetchYears(): Promise<Array<Year>> {
    return await httpClient
        .get(`/transactions/get-years`)
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}