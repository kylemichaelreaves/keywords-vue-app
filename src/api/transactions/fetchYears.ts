import {httpClient} from "@api/httpClient";
import type {Year} from "@types";

// TODO refactor url, pass years as params, maybe an all param
export async function fetchYears(): Promise<Array<Year>> {
    return await httpClient
        .get(`/transactions/years`)
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}