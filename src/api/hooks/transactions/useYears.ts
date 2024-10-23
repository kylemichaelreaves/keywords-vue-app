import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from '@tanstack/vue-query';
import type {Year} from "@types";
import {fetchYears} from "@api/transactions/fetchYears";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";

export const useYears = (): UseQueryReturnType<Year[], Error> => {
    const store = useTransactionsStore();
    const cachedYears = computed(() => store.getYears)
    return useQuery<Array<Year>>({
        queryKey: ['years'],
        queryFn: async () => {
            if (cachedYears.value.length > 0) {
                return cachedYears.value
            } else {
                const years = fetchYears()
                store.setYears(await years)
                return years
            }
        },
        refetchOnWindowFocus: false,
    })
}