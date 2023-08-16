"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var fetchSummaries_1 = require("../../transactions/fetchSummaries");
var transactionsStore_1 = require("../../../stores/transactionsStore");
var vue_1 = require("vue");
function useSummaries() {
    var store = (0, transactionsStore_1.useTransactionsStore)();
    var selectedMonth = (0, vue_1.computed)(function () { return store.getSelectedMonth; });
    var selectedWeek = (0, vue_1.computed)(function () { return store.getSelectedWeek; });
    return (0, vue_query_1.useQuery)({
        queryKey: ['summaries'],
        queryFn: function () {
            if (selectedWeek.value && selectedWeek.value !== '') {
                return (0, fetchSummaries_1.fetchSummaries)("week");
            }
            else if (selectedMonth.value && selectedMonth.value !== '') {
                return (0, fetchSummaries_1.fetchSummaries)("month");
            }
            else {
                return Promise.reject(new Error("Neither week nor month is selected"));
            }
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        enabled: !!selectedMonth.value || !!selectedWeek.value
    });
}
exports.default = useSummaries;
