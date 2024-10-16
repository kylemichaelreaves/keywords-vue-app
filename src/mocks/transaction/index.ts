import type {Memo, MemoSummary, MonthSummary, MonthYear, Transaction, WeekSummary, WeekYear} from "@types";
import type {DayYear} from "@types";

export const transactionsMock: Transaction[] = [
    {
        "Transaction Number": "XXXXXXX0000XXXX",
        "Date": "2024-09-30T00:00:00.000Z",
        "Description": "POS PURCHASE NON-PIN",
        "Memo": "Memo Name 1",
        "Amount Debit": -13.99,
        "Amount Credit": null,
        "Balance": 820.79,
        "Check Number": null,
        "Fees": null
    },
    {
        "Transaction Number": "XXXXXXX0000XXXX",
        "Date": "2024-09-30T00:00:00.000Z",
        "Description": "POS PURCHASE NON-PIN",
        "Memo": "Memo Name 2",
        "Amount Debit": -9.99,
        "Amount Credit": null,
        "Balance": 820.79,
        "Check Number": null,
        "Fees": null
    },
    {
        "Transaction Number": "XXXXXXX0000XXXX",
        "Date": "2024-09-30T00:00:00.000Z",
        "Description": "POS PURCHASE NON-PIN",
        "Memo": "Memo Name 3",
        "Amount Debit": -1.99,
        "Amount Credit": null,
        "Balance": 820.79,
        "Check Number": null,
        "Fees": null
    }

]

export const daysMock: DayYear[] = [
    {
        day: '12-31-2022',
    },
    {
        day: '12-30-2022',
    },
    {
        day: '12-29-2022',
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