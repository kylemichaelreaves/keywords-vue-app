import type {CarBudget, TimeframeType} from "@types";
import {httpClient} from "@api/httpClient";


export default async function fetchCarBudget(date: Date | null, timeFrame: TimeframeType): Promise<CarBudget> {
    return await httpClient
        .get(`/transactions`, {
            params: {
                timeFrame: timeFrame,
                date: date,
                budgetCategory: 'car'
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}