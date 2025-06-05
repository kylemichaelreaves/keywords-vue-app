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

    http.post("*/transactions/", (info) => {
        return new HttpResponse(JSON.stringify(transactionsMock[0]), {status: 200})
    }),

    http.get("*/transactions/months", (info) => {
        return new HttpResponse(JSON.stringify(monthsMock), {status: 200})
    }),

    http.get("*/transactions/days", (info) => {
        return new HttpResponse(JSON.stringify(daysMock), {status: 200})
    }),

    http.get("*/transactions/weeks", (info) => {
        return new HttpResponse(JSON.stringify(weeksMock), {status: 200})
    }),

    http.get("*/memos", (info) => {
        return new HttpResponse(JSON.stringify(memosMock), {status: 200})
    }),

    http.post("*/transactions/update-memo", (info) => {
        return new HttpResponse(JSON.stringify(memosMock[0]), {status: 200})
    }),

    http.get("*/memos/:memoId/summary", (info) => {
        return new HttpResponse(JSON.stringify(memoSummaryMock), {status: 200})
    }),

    http.get("*/transactions/months/:monthId/summary", (info) => {
        return new HttpResponse(JSON.stringify(monthSummaryMock), {status: 200})
    }),

    http.get('*/transactions/weeks/:weekId/summary', (info) => {
        return new HttpResponse(JSON.stringify(weekSummaryMock), {status: 200})
    }),

    http.get('*', (info) => {
        // console.error(`Unhandled request: ${req.url.toString()}`);
        // return res(ctx.status(500))
        return new HttpResponse('Unhandled request', {status: 500})
    }),

]

export default handlers