"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWeeks = void 0;
var vue_query_1 = require("@tanstack/vue-query");
var fetchWeeks_1 = require("../../transactions/fetchWeeks");
function useWeeks() {
    return (0, vue_query_1.useQuery)({
        queryKey: ['weeks'],
        queryFn: function () { return (0, fetchWeeks_1.fetchWeeks)(); },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
}
exports.useWeeks = useWeeks;
