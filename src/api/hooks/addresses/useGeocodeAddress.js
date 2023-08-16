"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_query_1 = require("@tanstack/vue-query");
var geocodeAddress_1 = require("../../address/geocodeAddress");
function useGeocodeAddress(address) {
    return (0, vue_query_1.useQuery)({
        queryKey: ['address', address],
        queryFn: function () { return (0, geocodeAddress_1.geocodeAddress)(address); },
        enabled: false
    });
}
exports.default = useGeocodeAddress;
