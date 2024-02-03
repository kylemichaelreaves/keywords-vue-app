import {http, HttpResponse, HttpHandler} from 'msw'
import {addressesMock} from "@mocks/address";
import {
    daysMock,
    memosMock,
    memoSummaryMock,
    monthsMock,
    monthSummaryMock,
    transactionsMock, weeksMock,
    weekSummaryMock
} from "@mocks/transaction";

const handlers: HttpHandler[] = [
    http.get('*/address-geocoder', (info) => {
        return new HttpResponse(JSON.stringify(addressesMock), {status: 200})
    }),

    http.get("*/transactions/get-transactions", (info) => {
        return new HttpResponse(JSON.stringify(transactionsMock), {status: 200})
    }),

    http.get("*/transactions/get-months", (info) => {
        return new HttpResponse(JSON.stringify(monthsMock), {status: 200})
    }),

    http.get("*/transactions/get-days", (info) => {
        return new HttpResponse(JSON.stringify(daysMock), {status: 200})
    }),

    http.get("*/transactions/get-weeks", (info) => {
        return new HttpResponse(JSON.stringify(weeksMock), {status: 200})
    }),

    http.get("*/transactions/get-memos", (info) => {
        return new HttpResponse(JSON.stringify(memosMock), {status: 200})
    }),

    http.get("*/transactions/get-memo-summary", (info) => {
        return new HttpResponse(JSON.stringify(memoSummaryMock), {status: 200})
    }),

    http.get("*/transactions/get-month-summary", (info) => {
        return new HttpResponse(JSON.stringify(monthSummaryMock), {status: 200})
    }),

    http.get('*/transactions/get-week-summary', (info) => {
        return new HttpResponse(JSON.stringify(weekSummaryMock), {status: 200})
    }),

    http.get('*', (info) => {
        // console.error(`Unhandled request: ${req.url.toString()}`);
        // return res(ctx.status(500))
        return new HttpResponse('Unhandled request', {status: 500})
    }),

]

export default handlers