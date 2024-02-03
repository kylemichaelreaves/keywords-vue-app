import axios from "axios";
import {isValidURL} from "@api/helpers/isValidURL";
import type {Memo} from "@types";

export const updateMemo = async (memo: string, budgetCategory: string): Promise<Memo> => {
        const postUrl = import.meta.env.VITE_APIGATEWAY_URL;

        if (!isValidURL(postUrl)) {
            throw Error('url is not valid');
        }

        return await axios
            .post(`${postUrl}/transactions/update-memo`, {
                memo,
                budgetCategory
            })
            .then((res) => res.data)
            .catch((err) => {
                console.log('err:', err);
                throw err;
            });
}