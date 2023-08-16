"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var vitest_1 = require("vitest");
var CustomSelect_vue_1 = require("@components/shared/CustomSelect.vue");
var element_plus_1 = require("element-plus");
var createWrapper = function (props) {
    return (0, test_utils_1.shallowMount)(CustomSelect_vue_1.default, {
        global: {
            plugins: [element_plus_1.ElSelect, element_plus_1.ElOption],
        },
        props: __assign(__assign({}, props), { options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
            ], filterable: true, clearable: true }),
    });
};
describe('CustomSelect', function () {
    var wrapper;
    beforeEach(function () {
        wrapper = (0, test_utils_1.mount)(CustomSelect_vue_1.default, {
            global: {
                plugins: [element_plus_1.ElSelect, element_plus_1.ElOption],
            },
            props: {
                selectedValue: '',
                placeholder: 'Select an option',
                options: [
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ],
                filterable: true,
                clearable: true
            },
        });
    });
    afterEach(function () {
        wrapper.unmount();
    });
    (0, vitest_1.test)('CustomSelect > should emit "update:selectedValue" when the selected value is changed', function (_a) {
        var expect = _a.expect;
        return __awaiter(void 0, void 0, void 0, function () {
            var select;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        select = wrapper.findComponent(element_plus_1.ElSelect);
                        // const select = wrapper.find('select');
                        return [4 /*yield*/, select.setValue('option1')];
                    case 1:
                        // const select = wrapper.find('select');
                        _c.sent();
                        return [4 /*yield*/, select.trigger('change')];
                    case 2:
                        _c.sent();
                        // Check if the "update:selectedValue" event is emitted with the correct value
                        console.log('wrapper.emitted()', wrapper.emitted());
                        expect(wrapper.emitted()).toHaveProperty('update:selectedValue');
                        expect((_b = wrapper.emitted()['update:selectedValue']) === null || _b === void 0 ? void 0 : _b[0]).toEqual(['option1']);
                        return [2 /*return*/];
                }
            });
        });
    });
    // test('CustomSelect > should render the component with default values', ({ expect }) => {
    //     // Check if the component is rendered correctly
    //     console.log('wrapper.html()', wrapper.html());
    //
    //     expect(wrapper.html()).toContain('Select an option');
    //
    //     // Get the options from the component instance
    //     const options = wrapper.props('options');
    //     expect(options.length).toBe(2);
    //     expect(options[0].label).toBe('Option 1');
    //     expect(options[0].value).toBe('option1');
    //     expect(options[1].label).toBe('Option 2');
    //     expect(options[1].value).toBe('option2');
    // });
    (0, vitest_1.test)('CustomSelect > should render the component with custom placeholder', function (_a) {
        var expect = _a.expect;
        // Mount the component with a custom placeholder
        var wrapper = (0, test_utils_1.mount)(CustomSelect_vue_1.default, {
            props: {
                options: [
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ],
                selectedValue: '',
                placeholder: 'Custom Placeholder',
                filterable: true,
                clearable: true
            },
        });
        var selectComponent = wrapper.vm.$refs.selectComponent;
        expect(selectComponent.placeholder).toBe('Custom Placeholder');
    });
    (0, vitest_1.test)('CustomSelect > should render the component without a clear icon when clearable is false', function (_a) {
        var expect = _a.expect;
        var wrapper = (0, test_utils_1.mount)(CustomSelect_vue_1.default, {
            props: {
                options: [
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ],
                selectedValue: '',
                placeholder: 'Select an option',
                filterable: true,
                clearable: false
            },
        });
        var selectComponent = wrapper.vm.$refs.selectComponent;
        expect(selectComponent.clearable).toBe(false);
    });
    (0, vitest_1.test)('CustomSelect > should render the component without a filter when filterable is false', function (_a) {
        var expect = _a.expect;
        var wrapper = (0, test_utils_1.mount)(CustomSelect_vue_1.default, {
            props: {
                options: [
                    { label: 'Option 1', value: 'option1' },
                    { label: 'Option 2', value: 'option2' },
                ],
                selectedValue: '',
                placeholder: 'Select an option',
                filterable: false,
                clearable: true
            },
        });
        var selectComponent = wrapper.vm.$refs.selectComponent;
        expect(selectComponent.filterable).toBe(false);
    });
    it('should render without a clear icon when clearable prop is set to false', function () {
        var wrapper = (0, test_utils_1.shallowMount)(CustomSelect_vue_1.default, {
            props: {
                clearable: false,
                filterable: true
            },
        });
        var selectComponent = wrapper.vm.$refs.selectComponent;
        expect(selectComponent.clearable).toBe(false);
    });
    it('should render without a filter when filterable prop is set to false', function () {
        var wrapper = (0, test_utils_1.shallowMount)(CustomSelect_vue_1.default, {
            props: {
                filterable: false,
                clearable: false
            },
        });
        var selectComponent = wrapper.vm.$refs.selectComponent;
        expect(selectComponent.filterable).toBe(false);
    });
});
