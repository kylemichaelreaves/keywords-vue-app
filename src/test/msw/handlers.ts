import {rest} from 'msw'
import {
    AddressResponse,
    Memo,
    MemoSummary,
    MonthSummary,
    MonthYear,
    Transaction,
    TransactionsList,
    WeekSummary, WeekYear
} from "@types/types";
import {addressesMock} from "@test/mock/address";
import {
    memosMock,
    memoSummaryMock,
    monthsMock,
    monthSummaryMock,
    transactionsMock, weeksMock,
    weekSummaryMock
} from "@test/mock/transaction";

const handlers = [
    rest.get('*/address-geocoder', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<AddressResponse[]>(addressesMock))
    }),

    rest.get("*/transactions/get-transactions", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<Transaction[]>(transactionsMock));
    }),

    rest.get("*/transactions/get-months", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<MonthYear[]>(monthsMock));
    }),

    rest.get("*/transactions/get-weeks", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<WeekYear[]>(weeksMock));
    }),

    rest.get("*/transactions/get-memos", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<Memo[]>(memosMock));
    }),

    rest.get("*/transactions/get-memo-summary", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<MemoSummary>(memoSummaryMock));
    }),

    rest.get("*/transactions/get-month-summary", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<MonthSummary[]>(monthSummaryMock));
    }),

    rest.get('*/transactions/get-week-summary', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<WeekSummary[]>(weekSummaryMock));
    }),

    rest.get('*', (req, res, ctx) => {
        console.error(`Unhandled request: ${req.url.toString()}`);
        return res(ctx.status(500))
    }),

]

export default handlers