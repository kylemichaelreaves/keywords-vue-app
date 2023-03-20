import {Transaction} from "./types";

function filterDataByMonth(data: Transaction[], selectedMonth: string): Transaction[] {
    if (selectedMonth) {
        return data.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth
        );
    } else {
        return data;
    }
}

function sumDebits(data: Transaction[], groupBy: 'month' | 'day'): Record<string, number> {
    return data.reduce((acc: Record<string, number>, cur) => {
        const [month, day, year] = cur.Date.split('/');
        const paddedMonth = month.length === 1 ? `0${month}` : month;
        const key = groupBy === 'month' ? `${paddedMonth}/${year}` : cur.Date;
        const amount = parseFloat(cur['Amount Debit']) || 0;
        acc[key] = (acc[key] || 0) + amount;
        return acc;
    }, {});
}

function filterDataByMemo(data: Transaction[], selectedMemo: string): Transaction[] {
    if (selectedMemo) {
        return data.filter((d: Transaction) => d.Memo === selectedMemo);
    } else {
        return data;
    }
}

export {filterDataByMonth, sumDebits, filterDataByMemo};