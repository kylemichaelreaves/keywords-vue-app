"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
function useMonthSummary() {
    return {
        data: (0, vue_1.ref)([
            {
                memo: 'Memo: Test 1',
                monthlyAmountDebit: -300,
            },
            {
                memo: 'Memo: Test 2',
                monthlyAmountDebit: -100,
            },
        ]),
        isError: (0, vue_1.ref)(false),
        refetch: jest.fn(),
        isFetching: (0, vue_1.ref)(false),
        isLoading: (0, vue_1.ref)(false),
        error: (0, vue_1.ref)(null),
    };
}
exports.default = useMonthSummary;
