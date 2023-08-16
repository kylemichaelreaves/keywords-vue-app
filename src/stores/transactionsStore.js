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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransactionsStore = void 0;
var pinia_1 = require("pinia");
var fetchMonths_1 = require("../api/transactions/fetchMonths");
var fetchWeeks_1 = require("../api/transactions/fetchWeeks");
var fetchMemos_1 = require("../api/transactions/fetchMemos");
var fetchOFAmountDebit_1 = require("../api/transactions/fetchOFAmountDebit");
var fetchMJAmountDebit_1 = require("../api/transactions/fetchMJAmountDebit");
var dataUtils_1 = require("../api/helpers/dataUtils");
var parseDateIWIYYY_1 = require("../api/helpers/parseDateIWIYYY");
exports.useTransactionsStore = (0, pinia_1.defineStore)('transactions', {
    state: function () { return ({
        selectedMonth: '',
        selectedMemo: '',
        selectedWeek: '',
        selectedType: 'Amount Debit',
        weeks: [],
        months: [],
        memos: [],
        OFSummaries: [],
        MJSummaries: [],
        weekSummaries: [],
        monthSummaries: [],
    }); },
    getters: {
        getSelectedMonth: function (state) {
            return state.selectedMonth;
        },
        getSelectedMemo: function (state) {
            return state.selectedMemo;
        },
        getSelectedWeek: function (state) {
            return state.selectedWeek;
        },
        getSelectedType: function (state) {
            return state.selectedType;
        },
        getWeeks: function (state) {
            return state.weeks;
        },
        getMonths: function (state) {
            return state.months;
        },
        getMemos: function (state) {
            return state.memos;
        },
        getOFSummaries: function (state) {
            return state.OFSummaries;
        },
        getMJSummaries: function (state) {
            return state.MJSummaries;
        },
        getWeekSummaries: function (state) {
            return state.weekSummaries;
        },
        getMonthSummaries: function (state) {
            return state.monthSummaries;
        }
    },
    actions: {
        setSelectedMonth: function (selectedMonth) {
            this.selectedMonth = selectedMonth;
        },
        setSelectedMemo: function (selectedMemo) {
            this.selectedMemo = selectedMemo;
        },
        setSelectedWeek: function (selectedWeek) {
            this.selectedWeek = selectedWeek;
        },
        setSelectedType: function (selectedType) {
            this.selectedType = selectedType;
        },
        setMonths: function (months) {
            console.log('setMonths called');
            this.months = months;
        },
        setWeeks: function (weeks) {
            this.weeks = weeks;
        },
        setOFSummaries: function (summaries) {
            this.OFSummaries = summaries;
        },
        setMJSummaries: function (summaries) {
            this.MJSummaries = summaries;
        },
        setWeekSummaries: function (summaries) {
            this.weekSummaries = summaries;
        },
        setMonthSummaries: function (summaries) {
            this.monthSummaries = summaries;
        },
        fetchWeeksData: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, fetchWeeks_1.fetchWeeks)().then(function (weeks) {
                                _this.weeks = weeks;
                            }).catch(function (err) {
                                console.log('err:', err);
                                throw err;
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        fetchMonthsData: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, fetchMonths_1.fetchMonths)().then(function (months) {
                                _this.months = months;
                            }).catch(function (err) {
                                console.log('err:', err);
                                throw err;
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        fetchPrevSummaries: function () {
            return __awaiter(this, void 0, void 0, function () {
                var dateType, dateSummaries, fetchOFSummary, fetchMJSummary, parsedDate, currentIndex, currentIndex, _loop_1, this_1, _i, dateSummaries_1, date;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateType = 'month';
                            dateSummaries = [];
                            fetchOFSummary = fetchOFAmountDebit_1.fetchOFAmountDebit;
                            fetchMJSummary = fetchMJAmountDebit_1.fetchMJAmountDebit;
                            if (this.selectedMonth) {
                                dateType = 'month';
                                currentIndex = this.months.findIndex(function (month) { return month.month_year === _this.selectedMonth; });
                                dateSummaries = this.months.slice(currentIndex, currentIndex + 3);
                                parsedDate = (0, dataUtils_1.parseDateMMYYYY)(this.selectedMonth);
                            }
                            else if (this.selectedWeek) {
                                dateType = 'week';
                                currentIndex = this.weeks.findIndex(function (week) { return week.week_year === _this.selectedWeek; });
                                dateSummaries = this.weeks.slice(currentIndex, currentIndex + 3);
                                parsedDate = (0, parseDateIWIYYY_1.parseDateIWIYYY)(this.selectedMonth);
                            }
                            _loop_1 = function (date) {
                                var OFsummary, MJSummary, dateNumberKey;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, fetchOFSummary(dateType, parsedDate)];
                                        case 1:
                                            OFsummary = _b.sent();
                                            return [4 /*yield*/, fetchMJSummary(dateType, parsedDate)];
                                        case 2:
                                            MJSummary = _b.sent();
                                            dateNumberKey = (0, dataUtils_1.getDateNumberKey)(dateType);
                                            // only add if not already in array
                                            if (!this_1.OFSummaries.some(function (summary) {
                                                return summary.year === OFsummary.year && summary[dateNumberKey] === OFsummary[dateNumberKey];
                                            })) {
                                                this_1.OFSummaries = __spreadArray(__spreadArray([], this_1.OFSummaries, true), [OFsummary], false);
                                            }
                                            // only add if not already in array
                                            if (!this_1.MJSummaries.some(function (summary) {
                                                return summary.year === MJSummary.year && summary[dateNumberKey] === MJSummary[dateNumberKey];
                                            })) {
                                                this_1.MJSummaries = __spreadArray(__spreadArray([], this_1.MJSummaries, true), [MJSummary], false);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, dateSummaries_1 = dateSummaries;
                            _a.label = 1;
                        case 1:
                            if (!(_i < dateSummaries_1.length)) return [3 /*break*/, 4];
                            date = dateSummaries_1[_i];
                            return [5 /*yield**/, _loop_1(date)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        fetchMemosData: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, fetchMemos_1.fetchMemos)().then(function (memos) {
                                _this.memos = memos;
                            }).catch(function (err) {
                                console.log('err:', err);
                                throw err;
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
});
