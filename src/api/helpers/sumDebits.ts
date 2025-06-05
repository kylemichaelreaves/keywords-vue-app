import type {Transaction} from "@types";

export function sumDebits(data: Transaction[], groupBy: 'month' | 'day'): Record<string, number> {
    return data.reduce((acc: Record<string, number>, cur) => {
        const [month, day, year] = cur.date.split('/');
        const paddedMonth = month.length === 1 ? `0${month}` : month;
        const key = groupBy === 'month' ? `${paddedMonth}/${year}` : cur.date;
        const amount = parseFloat(cur['amount_debit']) || 0;
        acc[key] = (acc[key] || 0) + amount;
        return acc;
    }, {});
}