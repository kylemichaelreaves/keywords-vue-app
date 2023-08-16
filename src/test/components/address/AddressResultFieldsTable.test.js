"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var element_plus_1 = require("element-plus");
var AddressResultFieldsTable_vue_1 = require("../../../components/address/AddressResultFieldsTable.vue");
describe('AddressResultFieldsTable', function () {
    var wrapper = (0, test_utils_1.mount)(AddressResultFieldsTable_vue_1.default, {
        global: {
            plugins: [element_plus_1.ElTable, element_plus_1.ElTableColumn]
        }
    });
    (0, vitest_1.test)('renders the table with the correct number of rows', function () {
    });
});
