"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWeeksMock = void 0;
// tests/mocks/useWeeks.mock.ts
var vue_1 = require("vue");
function useWeeksMock(weekData) {
    if (weekData === void 0) { weekData = []; }
    var data = (0, vue_1.ref)(weekData);
    var isLoading = (0, vue_1.ref)(false);
    var isFetching = (0, vue_1.ref)(false);
    var isError = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    return {
        data: data,
        isLoading: isLoading,
        isFetching: isFetching,
        isError: isError,
        error: error,
    };
}
exports.useWeeksMock = useWeeksMock;
