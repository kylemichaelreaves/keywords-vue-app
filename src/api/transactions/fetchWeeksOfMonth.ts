import { httpClient } from '@api/httpClient'


// TODO refactor url according to best API practices
export async function fetchWeeksOfMonth(monthString: string) {
  return await httpClient
    // TODO replace with /transactions/months/${monthString}/weeks
    .get(`/transactions/get-weeks-of-month`, {
      params: {
        month: monthString
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}