import type {Transaction} from "@types";

export function filterDataByMonth(data: Transaction[], selectedMonth: string): Transaction[] {
    if (selectedMonth) {
        return data.filter((d: Transaction) =>
            `${d.date.split('/')[0]}/${d.date.split('/')[2]}` === selectedMonth
        );
    } else {
        return data;
    }
}
