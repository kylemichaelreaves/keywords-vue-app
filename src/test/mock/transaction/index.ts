import {Memo, MonthYear, Transaction, WeekYear, WeekSummary} from "../../../types";

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

export const weekSummaryMock: WeekSummary[] = [
    {
        memo: 'Grocery Store',
        weekly_amount_debit: -100
    },
    {
        memo: 'Gas Station',
        weekly_amount_debit: -50
    }
]

export const weeksMock: WeekYear[] = [
    {
        week_year: '01-2023',
    },
    {
        week_year: '02-2023',
    },
    {
        week_year: '03-2023',
    }
]