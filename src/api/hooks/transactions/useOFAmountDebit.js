"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var fetchOFAmountDebit_1 = require("../../transactions/fetchOFAmountDebit");
var transactionsStore_1 = require("../../../stores/transactionsStore");
var vue_1 = require("vue");
var parseDateIWIYYY_1 = require("../../helpers/parseDateIWIYYY");
var dataUtils_1 = require("../../helpers/dataUtils");
// Get the Amount Debit for Memo's fitting the OF category, for a certain period of time
function useOFAmountDebit() {
    var store = (0, transactionsStore_1.useTransactionsStore)();
    var selectedMonth = (0, vue_1.computed)(function () { return store.getSelectedMonth; });
    var selectedWeek = (0, vue_1.computed)(function () { return store.getSelectedWeek; });
    var timeFrame = (0, vue_1.computed)(function () { return selectedWeek.value ? "week" : "month"; });
    var queryKey = (0, vue_1.computed)(function () { return ['OFAmountDebit', timeFrame.value, selectedMonth.value, selectedWeek.value]; });
    return (0, vue_query_1.useQuery)({
        queryKey: queryKey.value,
        queryFn: function () {
            var dateObj;
            if (timeFrame.value === "week" && selectedWeek.value) {
                dateObj = (0, parseDateIWIYYY_1.parseDateIWIYYY)(selectedWeek.value);
            }
            else if (timeFrame.value === "month" && selectedMonth.value) {
                dateObj = (0, dataUtils_1.parseDateMMYYYY)(selectedMonth.value);
            }
            return (0, fetchOFAmountDebit_1.fetchOFAmountDebit)(timeFrame.value, dateObj);
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false
    });
}
exports.default = useOFAmountDebit;
