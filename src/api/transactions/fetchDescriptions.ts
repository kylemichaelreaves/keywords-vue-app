import {httpClient} from "@api/httpClient";

export async function fetchDescriptions(): Promise<Array<string>> {
    try {
        const res = await httpClient.get(`/transactions/descriptions`)
        return res.data
    } catch (err) {
        console.error('Error fetching descriptions:', err)
        throw err
    }
}