import {rest} from 'msw'
import {AddressResponse, Memo, MonthYear, Transaction, TransactionsList, WeekSummary} from "../../types";
import {addressesMock} from "../mock/address";
import {memosMock, monthsMock, transactionsMock, weekSummaryMock} from "../mock/transaction";

export const handlers = [
    rest.get('*/address-geocoder', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<AddressResponse[]>(addressesMock))
    }),

    rest.get("*/transactions/get-transactions", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<Transaction[]>(transactionsMock));
    }),

    rest.get("*/transactions/get-months", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<MonthYear[]>(monthsMock));
    }),

    rest.get("*/transactions/get-memos", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<Memo[]>(memosMock));
    }),

    rest.get("*/transactions/get-week-summary", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<WeekSummary[]>(weekSummaryMock));
    }),

    rest.get('*', (req, res, ctx) => {
        console.error(`Unhandled request: ${req.url.toString()}`);
        return res(ctx.status(500))
    })

]
