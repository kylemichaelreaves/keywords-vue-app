"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMonths = void 0;
var vue_query_1 = require("@tanstack/vue-query");
var fetchMonths_1 = require("../../transactions/fetchMonths");
function useMonths() {
    return (0, vue_query_1.useQuery)({
        queryKey: ['months'],
        queryFn: function () { return (0, fetchMonths_1.fetchMonths)(); },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
}
exports.useMonths = useMonths;
