"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monthSummaryMock = exports.weekSummaryMock = exports.memoSummaryMock = exports.memosMock = exports.weeksMock = exports.monthsMock = exports.transactionsMock = void 0;
exports.transactionsMock = [
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
];
exports.monthsMock = [
    {
        month_year: '11/2022',
    },
    {
        month_year: '12/2022',
    },
    {
        month_year: '01/2023',
    }
];
exports.weeksMock = [
    {
        week_year: '12-2022',
    },
    {
        week_year: '13-2022',
    },
    {
        week_year: '14-2022',
    }
];
exports.memosMock = [
    {
        Memo: 'Test Memo 1',
    },
    {
        Memo: 'Test Memo 2',
    },
    {
        Memo: 'Test Memo 3',
    }
];
exports.memoSummaryMock = {
    sum_amount_debit: 100,
    transactions_count: 1,
};
exports.weekSummaryMock = [{
        weekly_amount_debit: -100,
        memo: 'Test Memo 1',
    }, {
        weekly_amount_debit: -300,
        memo: 'Test Memo 2',
    }];
exports.monthSummaryMock = [{
        monthly_amount_debit: -100,
        memo: 'Test Memo 1',
    }, {
        monthly_amount_debit: -300,
        memo: 'Test Memo 2',
    }];
