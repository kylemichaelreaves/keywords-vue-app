import { useQuery } from '@tanstack/vue-query';
import { fetchSummaries } from '@api/transactions/fetchSummaries';
import type { Summaries } from '@types';
import type { UseQueryReturnType } from '@tanstack/vue-query';
import { getDateTypeAndValue } from '@components/transactions/getDateTypeAndValue';

export default function useSummaries(): UseQueryReturnType<Summaries[], Error> {

    const { dateType, selectedValue } = getDateTypeAndValue();

    return useQuery<Array<Summaries>>({
        queryKey: ['summaries', dateType, selectedValue],
        queryFn: () => fetchSummaries(dateType),
        refetchOnWindowFocus: false,
        enabled: !!selectedValue,
    });
}
