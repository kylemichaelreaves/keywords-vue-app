"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionsTable_vue_1 = require("@components/transactions/TransactionsTable.vue");
var test_utils_1 = require("@vue/test-utils");
var vitest_1 = require("vitest");
var transaction_1 = require("@test/mock/transaction");
var element_plus_1 = require("element-plus");
var router_mock_1 = require("@test/router.mock");
describe("TransactionsTable", function () { return __awaiter(void 0, void 0, void 0, function () {
    var displayData, wrapper, tableHeaderCells;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, vitest_1.test)("renders the correct number of columns", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var linkedColumns, wrapper, tableHeaderCells;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                linkedColumns = ["transactionNumber", "memo"];
                                wrapper = (0, test_utils_1.mount)(TransactionsTable_vue_1.default, {
                                    props: {
                                        displayData: { rows: transaction_1.transactionsMock },
                                        linkedColumns: linkedColumns,
                                        isFetching: false,
                                    },
                                    global: {
                                        plugins: [router_mock_1.mockRouter, element_plus_1.ElTable, element_plus_1.ElTableColumn],
                                    },
                                });
                                return [4 /*yield*/, wrapper.vm.$nextTick()];
                            case 1:
                                _a.sent();
                                tableHeaderCells = wrapper.find("thead").findAll("th");
                                expect(tableHeaderCells.length).toBe(Object.keys(transaction_1.transactionsMock[0]).length);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.test)("renders the correct number of columns with linked columns", function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                }); });
                displayData = {
                    rows: [
                        { transactionNumber: "12345", date: "2023-01-01" },
                        // Add other rows as needed
                    ],
                };
                wrapper = (0, test_utils_1.mount)(TransactionsTable_vue_1.default, {
                    props: {
                        displayData: { rows: transaction_1.transactionsMock },
                        linkedColumns: ["transactionNumber"],
                        isFetching: false,
                    },
                    global: {
                        plugins: [router_mock_1.mockRouter, element_plus_1.ElTable, element_plus_1.ElTableColumn],
                    },
                });
                return [4 /*yield*/, wrapper.vm.$nextTick()];
            case 1:
                _a.sent();
                tableHeaderCells = wrapper.find("thead").findAll("th");
                expect(tableHeaderCells.length).toBe(Object.keys(displayData.rows[0]).length);
                return [2 /*return*/];
        }
    });
}); });
