import {httpClient} from "@api/httpClient";
import type {MonthYear} from "@types";

export async function fetchMonths(): Promise<Array<MonthYear>> {
    return await httpClient.get(`/transactions/get-months`)
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
            throw err;
        });
}
