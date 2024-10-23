import {useQuery} from '@tanstack/vue-query';
import {fetchMJAmountDebit} from '@api/transactions/fetchMJAmountDebit';
import {getDateTypeAndValue} from '@components/transactions/getDateTypeAndValue';
import {parseDateIWIYYY} from '@api/helpers/parseDateIWIYYY';
import {parseDateMMYYYY} from '@api/helpers/parseDateMMYYYY';
import type {UseQueryReturnType} from '@tanstack/vue-query';
import type {MJSummary} from '@types';
import {computed} from 'vue';

export default function useMJAmountDebit(): UseQueryReturnType<MJSummary, Error> {
    const {dateType, selectedValue} = getDateTypeAndValue();
    const queryKey = computed(() => ['MJAmountDebit', dateType, selectedValue?.value]);

    return useQuery<MJSummary>({
        queryKey: queryKey.value,
        queryFn: () => {
            // Determine the date object based on the date type
            let dateObj: Date | null = null;
            if (dateType === "week" && selectedValue) {
                dateObj = parseDateIWIYYY(selectedValue.value);
            } else if (dateType === "month" && selectedValue) {
                dateObj = parseDateMMYYYY(selectedValue.value);
            }

            if (!dateObj) {
                throw new Error("Invalid date");
            }

            return fetchMJAmountDebit(dateType, dateObj);
        },
        refetchOnWindowFocus: false,
        enabled: !!selectedValue
    });
}
