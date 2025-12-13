import { httpClient } from '@api/httpClient.ts'

export async function fetchWeeksOfMonth(monthString: string) {
  try {
    const res = await httpClient.get(`/transactions/months/${monthString}/weeks`, {
      params: {
        month: monthString,
      },
    })
    return res.data
  } catch (err) {
    console.error('Error fetching weeks of month:', { monthString }, err)
    throw err
  }
}
