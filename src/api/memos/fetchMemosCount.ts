import { httpClient } from '@api/httpClient.ts'

export async function fetchMemosCount(
  timeFrame?: string,
  date?: Date,
  distinct?: boolean,
): Promise<
  {
    count: number
  }[]
> {
  try {
    const res = await httpClient.get(`/memos?count=true`, {
      params: {
        timeFrame: timeFrame,
        date: date,
        distinct: distinct,
      },
    })
    return res.data
  } catch (err) {
    console.error('Error fetching memos count:', { timeFrame, date, distinct }, err)
    throw err
  }
}
