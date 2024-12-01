import type {Memo, MemoSummary, MonthSummary, MonthYear, Transaction, WeekSummary, WeekYear} from "@types";
import type {DayYear} from "@types";
import {DateTime} from "luxon";

export const transactionsMock: {
    "Transaction Number": string,
    "Date": string,
    "Description": string,
    "Memo": string,
    "Amount Debit": number,
    "Amount Credit": number | null,
    "Balance": number,
    "Check Number": number | null,
    "Fees": number | null
}[] = [
    {
        "Transaction Number": "XXXXXXX0001XXXX",
        "Date": "2024-09-28T00:00:00.000Z",
        "Description": "POS PURCHASE NON-PIN",
        "Memo": "Memo",
        "Amount Debit": -13.99,
        "Amount Credit": null,
        "Balance": 4820.79,
        "Check Number": null,
        "Fees": null
    },
    {
        "Transaction Number": "XXXXXXX0002XXXX",
        "Date": "2024-09-29T00:00:00.000Z",
        "Description": "POS PURCHASE NON-PIN",
        "Memo": "Memo",
        "Amount Debit": -9.99,
        "Amount Credit": null,
        "Balance": 820.79,
        "Check Number": null,
        "Fees": null
    },
    {
        "Transaction Number": "XXXXXXX0003XXXX",
        "Date": "2024-09-30T00:00:00.000Z",
        "Description": "POS PURCHASE NON-PIN",
        "Memo": "Memo",
        "Amount Debit": -1.99,
        "Amount Credit": null,
        "Balance": 820.79,
        "Check Number": null,
        "Fees": null
    }

]

export function generateTransactions(length: number) {
    const result = [];
    const startDate = DateTime.fromISO(transactionsMock[0]["Date"], {zone: 'utc'});

    for (let i = 1; i < length; i++) {
        const baseTransaction = transactionsMock[i % transactionsMock.length];
        const newTransaction = {
            ...baseTransaction,
            Date: startDate.plus({days: i}).toISO(),
            "Transaction Number": `XXXXXXX${String(i).padStart(4, '0')}XXXX`,
            Memo: `${baseTransaction["Memo"]} ${i + 1}`,
            Balance: baseTransaction["Balance"] + baseTransaction["Amount Debit"],
        };
        result.push(newTransaction);
    }
    return result;
}

interface IntervalData {
    date: string;
    total_amount_debit: number;
}

export const intervalsMock =
    [
        {
            "date": "2024-10-07T00:00:00.000Z",
            "total_amount_debit": -614.4100000000001
        },
        {
            "date": "2024-10-08T00:00:00.000Z",
            "total_amount_debit": -598.49
        },
        {
            "date": "2024-10-09T00:00:00.000Z",
            "total_amount_debit": -99.88000000000001
        },
        {
            "date": "2024-10-10T00:00:00.000Z",
            "total_amount_debit": -632.75
        },
        {
            "date": "2024-10-11T00:00:00.000Z",
            "total_amount_debit": -130.62
        },
        {
            "date": "2024-10-15T00:00:00.000Z",
            "total_amount_debit": -351.43000000000006
        },
        {
            "date": "2024-10-16T00:00:00.000Z",
            "total_amount_debit": -87.59
        },
        {
            "date": "2024-10-17T00:00:00.000Z",
            "total_amount_debit": -109.37
        },
        {
            "date": "2024-10-18T00:00:00.000Z",
            "total_amount_debit": -61.91
        },
        {
            "date": "2024-10-21T00:00:00.000Z",
            "total_amount_debit": -345.59000000000003
        },
        {
            "date": "2024-10-22T00:00:00.000Z",
            "total_amount_debit": -208.28000000000003
        },
        {
            "date": "2024-10-23T00:00:00.000Z",
            "total_amount_debit": -79.69
        },
        {
            "date": "2024-10-24T00:00:00.000Z",
            "total_amount_debit": -104.13
        },
        {
            "date": "2024-10-25T00:00:00.000Z",
            "total_amount_debit": -135.29
        },
        {
            "date": "2024-10-28T00:00:00.000Z",
            "total_amount_debit": -325.57
        },
        {
            "date": "2024-10-29T00:00:00.000Z",
            "total_amount_debit": -52.17
        },
        {
            "date": "2024-10-30T00:00:00.000Z",
            "total_amount_debit": -44.97
        },
        {
            "date": "2024-10-31T00:00:00.000Z",
            "total_amount_debit": -216.09
        }
    ]

export function generateDailyInterval(length: number): IntervalData[] {
    const result: IntervalData[] = [];
    const startDate = DateTime.fromISO(transactionsMock[0]["Date"]);

    for (let i = 1; i < length; i++) {
        const baseTransaction = transactionsMock[i % transactionsMock.length];

        // Increment the date by `i` days
        const date = startDate.plus({days: i}).toISODate();

        // Ensure the total_amount_debit is a negative integer
        const amountDebit = baseTransaction["Amount Debit"];
        const total_amount_debit = Math.floor(amountDebit); // Convert to integer

        result.push(<IntervalData>{
            date: date,
            total_amount_debit: total_amount_debit,
        });
    }

    return result;
}

export const daysMock: DayYear[] = [
    {
        day: '12-31-2022',
    },
    {
        day: '12-30-2022',
    },
    {
        day: '12-29-2022',
    },
    {
        day: '10-31-2022',
    },
    {
        day: '9-30-2022',
    }
]

export const monthsMock: MonthYear[] = [
    {
        month_year: '11/2022',
    },
    {
        month_year: '12/2022',
    },
    {
        month_year: '01/2023',
    }]

export const weeksMock: WeekYear[] = [
    {
        week_year: '12-2022',
    },
    {
        week_year: '13-2022',
    },
    {
        week_year: '14-2022',
    }
]

export const memosMock: Memo[] = [
    {
        name: 'Test Memo 1',
    },
    {
        name: 'Test Memo 2',
    },
    {
        name: 'Test Memo 3',
    }
]

export const memoSummaryMock: MemoSummary =
    {
        sum_amount_debit: 100,
        transactions_count: 1,
    }

export const weekSummaryMock: WeekSummary[] = [{
    weekly_amount_debit: -100,
    memo: 'Test Memo 1',
}, {
    weekly_amount_debit: -300,
    memo: 'Test Memo 2',
}]

export const monthSummaryMock: MonthSummary[] =
    [{
        monthly_amount_debit: -100,
        memo: 'Test Memo 1',
    }, {
        monthly_amount_debit: -300,
        memo: 'Test Memo 2',
    }]