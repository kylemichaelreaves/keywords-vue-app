"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var vue_1 = require("vue");
var transactionsStore_1 = require("../../../stores/transactionsStore");
var fetchMonthSummary_1 = require("../../transactions/fetchMonthSummary");
function useMonthSummary() {
    var store = (0, transactionsStore_1.useTransactionsStore)();
    var month = (0, vue_1.computed)(function () { return store.getSelectedMonth; });
    return (0, vue_query_1.useQuery)(['monthSummary', month.value], function () { return (0, fetchMonthSummary_1.fetchMonthSummary)(month.value); }, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        enabled: !!month.value
    });
}
exports.default = useMonthSummary;
