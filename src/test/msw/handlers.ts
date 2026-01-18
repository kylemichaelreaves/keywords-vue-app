import { http, HttpResponse, HttpHandler } from 'msw'
import { addressesMock } from '@mocks/address'
import {
  daysMock,
  memosMock,
  memoSummaryMock,
  monthsMock,
  monthSummaryMock,
  transactionsMock,
  weeksMock,
  weekSummaryMock,
} from '@mocks/transaction'

const handlers: HttpHandler[] = [
  http.get('*/address-geocoder', () => {
    return new HttpResponse(JSON.stringify(addressesMock), { status: 200 })
  }),

  http.post('*/transactions/', () => {
    return new HttpResponse(JSON.stringify(transactionsMock[0]), { status: 200 })
  }),

  http.get('*/transactions/months', () => {
    return new HttpResponse(JSON.stringify(monthsMock), { status: 200 })
  }),

  http.get('*/transactions/days', () => {
    return new HttpResponse(JSON.stringify(daysMock), { status: 200 })
  }),

  http.get('*/transactions/weeks', () => {
    return new HttpResponse(JSON.stringify(weeksMock), { status: 200 })
  }),

  http.get('*/memos', () => {
    return new HttpResponse(JSON.stringify(memosMock), { status: 200 })
  }),

  http.post('*/transactions/update-memo', () => {
    return new HttpResponse(JSON.stringify(memosMock[0]), { status: 200 })
  }),

  http.get('*/memos/:memoId/summary', () => {
    return new HttpResponse(JSON.stringify(memoSummaryMock), { status: 200 })
  }),

  http.get('*/transactions/months/:monthId/summary', () => {
    return new HttpResponse(JSON.stringify(monthSummaryMock), { status: 200 })
  }),

  http.get('*/transactions/weeks/:weekId/summary', () => {
    return new HttpResponse(JSON.stringify(weekSummaryMock), { status: 200 })
  }),

  http.get('*', () => {
    return new HttpResponse('Unhandled request', { status: 500 })
  }),
]

export default handlers
