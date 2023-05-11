import {Transaction} from "../../types";

function filterDataByMonth(data: Transaction[], selectedMonth: string): Transaction[] {
    if (selectedMonth) {
        return data.filter((d: Transaction) =>
            `${d.date.split('/')[0]}/${d.date.split('/')[2]}` === selectedMonth
        );
    } else {
        return data;
    }
}

function sumDebits(data: Transaction[], groupBy: 'month' | 'day'): Record<string, number> {
    return data.reduce((acc: Record<string, number>, cur) => {
        const [month, day, year] = cur.date.split('/');
        const paddedMonth = month.length === 1 ? `0${month}` : month;
        const key = groupBy === 'month' ? `${paddedMonth}/${year}` : cur.date;
        const amount = parseFloat(cur['amountDebit']) || 0;
        acc[key] = (acc[key] || 0) + amount;
        return acc;
    }, {});
}

function filterDataByMemo(data: Transaction[], selectedMemo: string): Transaction[] {
    if (selectedMemo) {
        return data.filter((d: Transaction) => d.memo === selectedMemo);
    } else {
        return data;
    }
}

function parseDateMMYYYY(input: string): Date | null {
    const regex = /^(\d{2})\/(\d{4})$/;
    const match = input.match(regex);

    if (!match) {
        return null;
    }

    const month = parseInt(match[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(match[2], 10);

    if (month < 0 || month > 11) {
        return null;
    }

    return new Date(year, month);
}
function formatKey(key: string): string {
    if (!key) return "";

    const words = key.replace(/_/g, " ").split(" ");
    const capitalizedWords = words.map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return capitalizedWords.join(" ");
}


const isDateSameAsPrevious = (currentDate: string, index: number, tableData: Transaction[]) => {
    if (index === 0) return false;
    const previousDate = tableData[index - 1].date;
    return formatDate(currentDate) === formatDate(previousDate);
};


function formatDate(dateString: string, format: string = 'YYYY-MM-DD'): string {
    // Input validation: Check if dateString matches the expected format
    let date = new Date(dateString);

    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();


    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    // Custom output format function
    const padZero = (num: number): string => String(num).padStart(2, '0');
    const formattedDate = {
        'YYYY': padZero(year),
        'MM': padZero(month),
        'DD': padZero(day),
    };

    // Replace placeholders with their corresponding date values
    return format.replace(/YYYY|MM|DD/g, (match) => formattedDate[match as keyof typeof formattedDate]);
}


export {filterDataByMonth, formatKey, sumDebits, isDateSameAsPrevious, filterDataByMemo, parseDateMMYYYY, formatDate};