"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRouter = void 0;
// src/spec/router.mock.ts
var vue_router_1 = require("vue-router");
exports.mockRouter = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createMemoryHistory)(),
    routes: [],
});
