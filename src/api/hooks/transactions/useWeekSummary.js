"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var fetchWeekSummary_1 = require("../../transactions/fetchWeekSummary");
var vue_1 = require("vue");
var transactionsStore_1 = require("../../../stores/transactionsStore");
function useWeekSummary() {
    var store = (0, transactionsStore_1.useTransactionsStore)();
    var week = (0, vue_1.computed)(function () { return store.getSelectedWeek; });
    return (0, vue_query_1.useQuery)({
        queryKey: ['weekSummary', week.value],
        queryFn: function () { return (0, fetchWeekSummary_1.fetchWeekSummary)(week.value); },
        keepPreviousData: true,
        refetchOnWindowFocus: false
    });
}
exports.default = useWeekSummary;
