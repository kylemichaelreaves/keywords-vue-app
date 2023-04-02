import axios from "axios";
import { API_GATEWAY_URL } from "../../constants";
import {AddressFields, AddressResponse} from "../../types";

export const fetchAddress = async (address: AddressFields): Promise<AddressResponse[]> => {
    const queryStringParams = new URLSearchParams(Object.entries(address));

    return typeof address === "undefined"
        ? Promise.reject(new Error("address is undefined"))
        : await axios
            .get(`${API_GATEWAY_URL}/address-geocoder`, {
                params: {
                    address: queryStringParams,
                },
            })
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                // Throw the error or return a rejected promise
                return Promise.reject(error);
            });
};