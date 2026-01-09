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
    http.get('*/address-geocoder', (_info) => {
        return new HttpResponse(JSON.stringify(addressesMock), {status: 200})
    }),

    http.post("*/transactions/", (_info) => {
        return new HttpResponse(JSON.stringify(transactionsMock[0]), {status: 200})
    }),

    http.get("*/transactions/months", (_info) => {
        return new HttpResponse(JSON.stringify(monthsMock), {status: 200})
    }),

    http.get("*/transactions/days", (_info) => {
        return new HttpResponse(JSON.stringify(daysMock), {status: 200})
    }),

    http.get("*/transactions/weeks", (_info) => {
        return new HttpResponse(JSON.stringify(weeksMock), {status: 200})
    }),

    http.get("*/memos", (_info) => {
        return new HttpResponse(JSON.stringify(memosMock), {status: 200})
    }),

    http.post("*/transactions/update-memo", (_info) => {
        return new HttpResponse(JSON.stringify(memosMock[0]), {status: 200})
    }),

    http.get("*/memos/:memoId/summary", (_info) => {
        return new HttpResponse(JSON.stringify(memoSummaryMock), {status: 200})
    }),

    http.get("*/transactions/months/:monthId/summary", (_info) => {
        return new HttpResponse(JSON.stringify(monthSummaryMock), {status: 200})
    }),

    http.get('*/transactions/weeks/:weekId/summary', (_info) => {
        return new HttpResponse(JSON.stringify(weekSummaryMock), {status: 200})
    }),

    http.get('*', (_info) => {
        // console.error(`Unhandled request: ${req.url.toString()}`);
        // return res(ctx.status(500))
        return new HttpResponse('Unhandled request', {status: 500})
    }),

]

export default handlers