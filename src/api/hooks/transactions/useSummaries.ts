import {useQuery} from '@tanstack/vue-query';
import {fetchSummaries} from '@api/transactions/fetchSummaries';
import type {Summaries} from '@types';
import type {UseQueryReturnType} from '@tanstack/vue-query';
import {getDateTypeAndValue} from '@components/transactions/getDateTypeAndValue';
import {computed} from "vue";
import {useTransactionsStore} from "@stores/transactions";

export default function useSummaries() {

    const {dateType, selectedValue} = getDateTypeAndValue();
    const store = useTransactionsStore();

    // eslint-disable-next-line vue/return-in-computed-property
    const cachedSummaries = computed(() => {
        switch (dateType) {
            case 'day':
                return store.getDaysSummaries;
            case 'week':
                return store.getWeeksSummaries;
            case 'month':
                // console.log('store.getMonthsSummaries', store.getMonthsSummaries);
                return store.getMonthsSummaries;
        }
    });


    return useQuery<Array<Summaries>>({
        queryKey: ['summaries', dateType, selectedValue],
        queryFn: () => {
            if (cachedSummaries.value && cachedSummaries?.value?.length > 0) {
                // console.log('cachedSummaries.value', cachedSummaries.value);
                return cachedSummaries.value;
            } else {
                return fetchSummaries(dateType)
                    .then((summaries) => {
                        switch (dateType) {
                            case 'day':
                                store.setDaysSummaries(summaries);
                                break;
                            case 'week':
                                store.setWeeksSummaries(summaries);
                                break;
                            case 'month':
                                store.setMonthsSummaries(summaries);
                                break;
                        }
                        return summaries;
                    });
            }
        },
        refetchOnWindowFocus: false,
        enabled: !!selectedValue,
        // staleTime: 1000 * 60 * 5, // five minutes
    });
}
