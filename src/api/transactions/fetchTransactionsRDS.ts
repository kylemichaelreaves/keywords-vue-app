import {TransactionsList} from "../../types";
import axios from "axios";
import {API_GATEWAY_URL} from "../../constants";

export async function fetchTransactionsRDS(limit: number, offset: number, fetchURL?: string):
    Promise<TransactionsList['data']> {
    // check if fetchURL is valid
    // if not, use API_GATEWAY_URL
    if (!fetchURL) {
        if (!API_GATEWAY_URL) {
            throw Error('API_GATEWAY_URL is not defined');
        } else {
            fetchURL = API_GATEWAY_URL;
        }
    }
    try {
        const response =
            await axios.get(`${fetchURL}/transactions/get-transactions`, {
                params: {
                    limit,
                    offset,
                },
            });
        console.log('response:', response.data);
        return response.data;
    } catch (error: any) {
        console.log('error', error.message);
        return [];
    }
}