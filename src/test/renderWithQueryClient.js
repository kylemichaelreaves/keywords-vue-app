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
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWithQueryClient = void 0;
var vue_1 = require("vue");
var vue_2 = require("@testing-library/vue");
var vue_query_1 = require("@tanstack/vue-query");
var element_plus_1 = require("element-plus");
var renderWithQueryClient = function (component, options, config) {
    var queryClient = new vue_query_1.QueryClient(__assign({ defaultOptions: {
            queries: {
                retry: false,
            },
        }, logger: {
            log: console.log,
            warn: console.warn,
            error: function () {
            }
        } }, config));
    var app = (0, vue_1.createApp)({
        components: {
            component: component,
            ElementPlus: element_plus_1.default,
            VueQueryPlugin: vue_query_1.VueQueryPlugin
        },
        setup: function () {
            return function () { return (0, vue_1.h)(component, options); };
        },
    });
    app.use(vue_query_1.VueQueryPlugin, { queryClient: queryClient });
    app.use(element_plus_1.default);
    return (0, vue_2.render)(app, __assign({}, options));
};
exports.renderWithQueryClient = renderWithQueryClient;
