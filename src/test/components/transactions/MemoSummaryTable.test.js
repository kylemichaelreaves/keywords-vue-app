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
var test_utils_1 = require("@vue/test-utils");
var MemoSummaryTable_vue_1 = require("@components/transactions/MemoSummaryTable.vue");
var element_plus_1 = require("element-plus");
var vue_query_1 = require("@tanstack/vue-query");
var testing_1 = require("@pinia/testing");
var transactionsStore_1 = require("@stores/transactionsStore");
var test_setup_1 = require("@test/test-setup");
beforeAll(function () { return test_setup_1.server.listen(); });
afterEach(function () { return test_setup_1.server.resetHandlers(); });
afterAll(function () { return test_setup_1.server.close(); });
// Add this to the beginning of your test file or a test setup file
global.requestAnimationFrame = function (cb) {
    return setTimeout(cb, 0);
};
global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};
describe('MemoSummaryTable.vue', function () {
    afterEach(function () {
        vi.clearAllMocks();
        vi.clearAllTimers();
    });
    test.skip('renders the MemoSummaryTable with the correct fields', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, store, table, columns, sumAmountDebit, transactionsCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(MemoSummaryTable_vue_1.default, {
                        global: {
                            components: {
                                ElTable: element_plus_1.ElTable,
                                ElStatistic: element_plus_1.ElStatistic,
                                ElTableColumn: element_plus_1.ElTableColumn,
                                ElCard: element_plus_1.ElCard,
                            },
                            plugins: [vue_query_1.VueQueryPlugin, (0, testing_1.createTestingPinia)()],
                        },
                        provide: {
                            memoTableData: [{
                                    transactions_count: 'Memo: Test 1',
                                    sum_amount_debit: -300,
                                }],
                        }
                    });
                    store = (0, transactionsStore_1.useTransactionsStore)();
                    store.selectedMemo = 'Memo: Test';
                    // Wait for the component to finish loading data
                    return [4 /*yield*/, wrapper.vm.$nextTick()];
                case 1:
                    // Wait for the component to finish loading data
                    _a.sent();
                    table = wrapper.findComponent(element_plus_1.ElTable);
                    columns = wrapper.findAllComponents(element_plus_1.ElTableColumn);
                    // Check if the table is rendered
                    expect(table.exists()).toBe(true);
                    // Check if the correct number of columns is rendered
                    expect(columns.length).toBe(2);
                    // Check if the correct column labels are rendered
                    expect(columns[0].props('label')).toBe('Sum Amount Debit');
                    expect(columns[1].props('label')).toBe('Transactions Count');
                    sumAmountDebit = wrapper.find('[data-testid="sum-amount-debit"]');
                    transactionsCount = wrapper.find('[data-testid="transactions-count"]');
                    return [2 /*return*/];
            }
        });
    }); });
});
