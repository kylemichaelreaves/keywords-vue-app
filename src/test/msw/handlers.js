"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var msw_1 = require("msw");
var address_1 = require("@test/mock/address");
var transaction_1 = require("@test/mock/transaction");
var handlers = [
    msw_1.rest.get('*/address-geocoder', function (req, res, ctx) {
        return res(ctx.status(200), ctx.json(address_1.addressesMock));
    }),
    msw_1.rest.get("*/transactions/get-transactions", function (req, res, ctx) {
        return res(ctx.status(200), ctx.json(transaction_1.transactionsMock));
    }),
    msw_1.rest.get("*/transactions/get-months", function (req, res, ctx) {
        return res(ctx.status(200), ctx.json(transaction_1.monthsMock));
    }),
    msw_1.rest.get("*/transactions/get-weeks", function (req, res, ctx) {
        return res(ctx.status(200), ctx.json(transaction_1.weeksMock));
    }),
    msw_1.rest.get("*/transactions/get-memos", function (req, res, ctx) {
        return res(ctx.status(200), ctx.json(transaction_1.memosMock));
    }),
    msw_1.rest.get("*/transactions/get-memo-summary", function (req, res, ctx) {
        return res(ctx.status(200), ctx.json(transaction_1.memoSummaryMock));
    }),
    msw_1.rest.get("*/transactions/get-month-summary", function (req, res, ctx) {
        return res(ctx.status(200), ctx.json(transaction_1.monthSummaryMock));
    }),
    msw_1.rest.get('*/transactions/get-week-summary', function (req, res, ctx) {
        return res(ctx.status(200), ctx.json(transaction_1.weekSummaryMock));
    }),
    msw_1.rest.get('*', function (req, res, ctx) {
        console.error("Unhandled request: ".concat(req.url.toString()));
        return res(ctx.status(500));
    }),
];
exports.default = handlers;
