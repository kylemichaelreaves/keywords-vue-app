import { useQuery } from '@tanstack/vue-query';
import { fetchSummaries } from '@api/transactions/fetchSummaries';
import type { Summaries } from '@types';
import type { UseQueryReturnType } from '@tanstack/vue-query';
import { getDateTypeAndValue } from '@components/transactions/getDateTypeAndValue';

export default function useSummaries(): UseQueryReturnType<Summaries[], Error> {
    // Use the helper function to get the date type and selected value
    const { dateType, selectedValue } = getDateTypeAndValue();

    return useQuery<Array<Summaries>>({
        queryKey: ['summaries', dateType, selectedValue],
        queryFn: () => {
            if (!dateType || dateType === 'unknown') {
                // Handle case where no valid date type is selected
                return Promise.reject(new Error('Neither day, week, nor month is selected'));
            }

            // Call fetchSummaries with the appropriate date type
            return fetchSummaries(dateType);
        },
        refetchOnWindowFocus: false,
        enabled: !!selectedValue, // Enable query only when there is a valid selected value
    });
}
