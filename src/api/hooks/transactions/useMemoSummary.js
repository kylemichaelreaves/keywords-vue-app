"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var fetchMemoSummary_1 = require("../../transactions/fetchMemoSummary");
var transactionsStore_1 = require("../../../stores/transactionsStore");
var vue_1 = require("vue");
function useMemoSummary() {
    var store = (0, transactionsStore_1.useTransactionsStore)();
    var selectedMemo = (0, vue_1.computed)(function () { return store.getSelectedMemo; });
    return (0, vue_query_1.useQuery)({
        queryKey: ['memoSummary', selectedMemo.value],
        queryFn: function () { return (0, fetchMemoSummary_1.fetchMemoSummary)(selectedMemo.value); },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        // Only execute the query if selectedMemo.value is not null or undefined
        enabled: !!selectedMemo.value
    });
}
exports.default = useMemoSummary;
