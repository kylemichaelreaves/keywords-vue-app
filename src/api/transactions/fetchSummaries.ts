import type {Summaries} from "@types";
import {httpClient} from "@api/httpClient";

export async function fetchSummaries(timeFrame: string) {
    return await httpClient.get<Array<Summaries>>(`/transactions/get-summaries`, {
        params: {
            timeFrame
        },
    })
        .then((res) => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}