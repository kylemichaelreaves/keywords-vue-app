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
var vue_1 = require("vue");
var Keywords_vue_1 = require("@components/Keywords.vue");
var element_plus_1 = require("element-plus");
describe('Keywords.vue', function () {
    var wrapper;
    beforeEach(function () {
        wrapper = (0, test_utils_1.mount)(Keywords_vue_1.default, {
            global: {
                plugins: [element_plus_1.default],
            },
        });
    });
    afterEach(function () {
        wrapper.unmount();
    });
    it('initializes "keywords" ref with an empty string', function (done) {
        setTimeout(function () {
            if (wrapper.emitted()['update:keywords']) {
                expect(wrapper.emitted()['update:keywords'][0]).toEqual(['']);
            }
            else {
                expect("Event 'update:keywords' was not emitted");
            }
        }, 0);
    });
    it('updates "keywords" ref when input is changed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var elInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    elInput = wrapper.findComponent(element_plus_1.ElInput);
                    return [4 /*yield*/, elInput.setValue('testing')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, elInput.trigger('input')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 3:
                    _a.sent();
                    expect(wrapper.vm.keywords).toEqual('testing');
                    return [2 /*return*/];
            }
        });
    }); });
    it('can be reset', function () { return __awaiter(void 0, void 0, void 0, function () {
        var elInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    elInput = wrapper.findComponent(element_plus_1.ElInput);
                    return [4 /*yield*/, elInput.setValue('testing')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, elInput.trigger('input')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 3:
                    _a.sent();
                    // Set the input value to an empty string and trigger the 'input' event
                    return [4 /*yield*/, elInput.setValue('')];
                case 4:
                    // Set the input value to an empty string and trigger the 'input' event
                    _a.sent();
                    return [4 /*yield*/, elInput.trigger('input')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 6:
                    _a.sent();
                    expect(wrapper.vm.keywords).toEqual('');
                    return [2 /*return*/];
            }
        });
    }); });
});
