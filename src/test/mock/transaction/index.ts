import {Memo, MemoSummary, MonthSummary, MonthYear, Transaction, WeekSummary} from "../../../types";

export const transactionsMock: Transaction[] = [
    {
        transactionNumber: '1',
        date: '2022-12-31',
        memo: 'Test Transaction',
        amountDebit: '10.00',
    },
    {
        transactionNumber: '2',
        date: '2022-12-31',
        memo: 'Test Transaction',
        amountDebit: '20.00',
    },
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


export const memosMock: Memo[] = [
    {
        Memo: 'Test Memo 1',
    },
    {
        Memo: 'Test Memo 2',
    },
    {
        Memo: 'Test Memo 3',
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