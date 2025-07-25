import { httpClient } from '@api/httpClient'


export default async function fetchOldestTransactionDate() {
  return await httpClient
    .get(`/transactions`, {
      params: { oldestDate: true }
    })
    .then((res) => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}
