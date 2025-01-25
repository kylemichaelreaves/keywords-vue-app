import type {CarBudget, TimeframeType} from "@types";
import {httpClient} from "@api/httpClient";

// returns a CarBudget for a given date, for a given timeFrame
export default async function fetchCarBudget(date: Date | null, timeFrame: TimeframeType): Promise<CarBudget> {
    // TODO instead of a path, pass query params to transactions route, budgetCategory
    return await httpClient
        .get(`/transactions/get-car-budget`, {
            params: {
                timeFrame: timeFrame,
                date: date
            }
        })
        .then(res => res.data)
        .catch((err: Error) => {
            console.error('err:', err);
        });
}