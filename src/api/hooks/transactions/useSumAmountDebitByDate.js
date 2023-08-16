"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var fetchSumAmountDebitByDate_1 = require("../../transactions/fetchSumAmountDebitByDate");
var parseDateIWIYYY_1 = require("../../helpers/parseDateIWIYYY");
var dataUtils_1 = require("../../helpers/dataUtils");
var transactionsStore_1 = require("../../../stores/transactionsStore");
var vue_1 = require("vue");
function useSumAmountDebitByDate(timeFrame, date) {
    var store = (0, transactionsStore_1.useTransactionsStore)();
    var selectedMonth = (0, vue_1.computed)(function () { return store.getSelectedMonth; });
    var selectedWeek = (0, vue_1.computed)(function () { return store.getSelectedWeek; });
    var dateType = (0, vue_1.computed)(function () { return selectedWeek.value ? "week" : "month"; });
    return (0, vue_query_1.useQuery)({
        queryKey: ['sumAmountDebitByDate', timeFrame, date],
        queryFn: function () {
            var dateObj;
            if (dateType.value === "week" && selectedWeek.value) {
                dateObj = (0, parseDateIWIYYY_1.parseDateIWIYYY)(selectedWeek.value);
            }
            else if (dateType.value === "month" && selectedMonth.value) {
                dateObj = (0, dataUtils_1.parseDateMMYYYY)(selectedMonth.value);
            }
            return (0, fetchSumAmountDebitByDate_1.fetchSumAmountDebitByDate)(timeFrame, dateObj);
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false
    });
}
exports.default = useSumAmountDebitByDate;
