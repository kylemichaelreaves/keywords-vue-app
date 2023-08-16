"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var isValidURL_1 = require("../../../api/helpers/isValidURL");
(0, vitest_1.test)('isValidURL > should return true for a valid URL', function (_a) {
    var expect = _a.expect;
    var validURL = 'https://example.com';
    expect((0, isValidURL_1.isValidURL)(validURL)).toBe(true);
});
(0, vitest_1.test)('isValidURL > should return false for an invalid URL', function (_a) {
    var expect = _a.expect;
    var invalidURL = 'not-a-url';
    expect((0, isValidURL_1.isValidURL)(invalidURL)).toBe(false);
});
(0, vitest_1.test)('isValidURL > should return false for an empty string', function (_a) {
    var expect = _a.expect;
    var emptyString = '';
    expect((0, isValidURL_1.isValidURL)(emptyString)).toBe(false);
});
(0, vitest_1.test)('isValidURL > should return false for a null value', function (_a) {
    var expect = _a.expect;
    var nullValue = null;
    expect((0, isValidURL_1.isValidURL)(nullValue)).toBe(false);
});
