"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var fetchTransactions_1 = require("../../transactions/fetchTransactions");
var vue_1 = require("vue");
var transactionsStore_1 = require("../../../stores/transactionsStore");
var dataUtils_1 = require("../../helpers/dataUtils");
var parseDateIWIYYY_1 = require("../../helpers/parseDateIWIYYY");
function useTransactions(LIMIT, OFFSET) {
    if (LIMIT === void 0) { LIMIT = 100; }
    var store = (0, transactionsStore_1.useTransactionsStore)();
    var selectedMemo = (0, vue_1.computed)(function () { return store.getSelectedMemo; });
    var selectedMonth = (0, vue_1.computed)(function () { return store.getSelectedMonth; });
    var selectedWeek = (0, vue_1.computed)(function () { return store.getSelectedWeek; });
    var dateType = (0, vue_1.computed)(function () { return selectedWeek.value ? "week" : "month"; });
    var queryKey = (0, vue_1.computed)(function () { return ['transactions', LIMIT, OFFSET, selectedMemo.value, dateType.value, selectedMonth.value, selectedWeek.value]; });
    return (0, vue_query_1.useQuery)({
        queryKey: queryKey.value,
        queryFn: function () {
            // Convert the date string to a Date object based on the dateType
            var dateObj;
            if (dateType.value === "week") {
                dateObj = selectedWeek.value ? (0, parseDateIWIYYY_1.parseDateIWIYYY)(selectedWeek.value) : null;
            }
            else if (dateType.value === "month") {
                dateObj = selectedMonth.value ? (0, dataUtils_1.parseDateMMYYYY)(selectedMonth.value) : null;
            }
            return (0, fetchTransactions_1.fetchTransactions)(LIMIT, OFFSET, selectedMemo.value, dateType.value, dateObj);
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false
    });
}
exports.default = useTransactions;
