import {rest} from 'msw'
import {AddressResponse, Transaction, TransactionsList} from "../../types";
import {addressesMock} from "../mock/address";
import {transactionsMock} from "../mock/transaction";

export const handlers = [
    rest.get('*/address-geocoder', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<AddressResponse[]>(addressesMock))
    }),

    rest.get("*/transactions/get-transactions", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json<Transaction[]>(transactionsMock));
    }),

    rest.get('*', (req, res, ctx) => {
        console.error(`Unhandled request: ${req.url.toString()}`);
        return res(ctx.status(500))
    })

]
