"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var parseDateIWIYYY_1 = require("../../../api/helpers/parseDateIWIYYY");
describe('parseDateIWIYYY', function () {
    // Test valid input cases
    vitest_1.test.skip('parseDateIWIYYY should return the correct date for valid input', function () {
        var _a, _b, _c;
        expect((_a = (0, parseDateIWIYYY_1.parseDateIWIYYY)('01-2023')) === null || _a === void 0 ? void 0 : _a.toISOString()).toEqual(new Date(2023, 0, 1).toISOString());
        expect((_b = (0, parseDateIWIYYY_1.parseDateIWIYYY)('02-2023')) === null || _b === void 0 ? void 0 : _b.toISOString()).toEqual(new Date(2023, 0, 1).toISOString());
        expect((_c = (0, parseDateIWIYYY_1.parseDateIWIYYY)('52-2021')) === null || _c === void 0 ? void 0 : _c.toISOString()).toEqual(new Date(2021, 11, 19).toISOString());
    });
    // Test invalid input cases
    (0, vitest_1.test)('parseDateIWIYYY should return null for invalid input format', function () {
        expect((0, parseDateIWIYYY_1.parseDateIWIYYY)('01/2023')).toBeNull();
        expect((0, parseDateIWIYYY_1.parseDateIWIYYY)('1-2023')).toBeNull();
        expect((0, parseDateIWIYYY_1.parseDateIWIYYY)('02-23')).toBeNull();
    });
    // Test out of range week numbers
    (0, vitest_1.test)('parseDateIWIYYY should return null for out of range week numbers', function () {
        expect((0, parseDateIWIYYY_1.parseDateIWIYYY)('00-2023')).toBeNull();
        expect((0, parseDateIWIYYY_1.parseDateIWIYYY)('54-2023')).toBeNull();
    });
});
