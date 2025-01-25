import type {WeekYear} from "@types";
import {httpClient} from "@api/httpClient";

export async function fetchWeeks(): Promise<Array<WeekYear>> {
    return await httpClient.get(`/transactions/get-weeks`)
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}
