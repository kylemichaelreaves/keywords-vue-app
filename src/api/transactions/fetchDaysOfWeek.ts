import { httpClient } from '@api/httpClient'


export async function fetchDaysOfWeek(week: string) {
  try {
    const res = await httpClient.get(`/transactions/weeks/${week}/days`)
    return res.data
  } catch (err) {
    console.error('Error fetching days of week:', { week }, err)
    throw err
  }
}