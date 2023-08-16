"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var fetchMemos_1 = require("../../transactions/fetchMemos");
var transactionsStore_1 = require("../../../stores/transactionsStore");
var vue_1 = require("vue");
function useMemos() {
    var store = (0, transactionsStore_1.useTransactionsStore)();
    var selectedMonth = (0, vue_1.computed)(function () { return store.getSelectedMonth; });
    var queryKeyText = (0, vue_1.computed)(function () { return ['memos', selectedMonth.value]; });
    return (0, vue_query_1.useQuery)({
        queryKey: ['memos', queryKeyText.value],
        queryFn: function () { return (0, fetchMemos_1.fetchMemos)(selectedMonth.value); },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
}
exports.default = useMemos;
