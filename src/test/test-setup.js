"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
/// <reference types="vitest/globals" />
require("@testing-library/jest-dom");
require("@testing-library/jest-dom/extend-expect");
var node_1 = require("msw/node");
var vitest_1 = require("vitest");
var handlers_1 = require("./msw/handlers");
exports.server = node_1.setupServer.apply(void 0, handlers_1.default);
(0, vitest_1.beforeAll)(function () { return exports.server.listen(); });
(0, vitest_1.afterEach)(function () { return exports.server.resetHandlers(); });
(0, vitest_1.afterAll)(function () { return exports.server.close(); });
