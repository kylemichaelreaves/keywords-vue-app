import {httpClient} from "@api/httpClient";

export async function fetchDaysOfWeek(weekString: string) {
    return await httpClient
        .get(`/transactions/get-days-of-week`, {
            params: {
                week: weekString
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}