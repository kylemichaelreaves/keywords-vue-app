import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from '@tanstack/vue-query';
import type {Year} from "@types";
import {fetchYears} from "@api/transactions/fetchYears";
import {useTransactionsStore} from "@stores/transactions";

export const useYears = (): UseQueryReturnType<Year[], Error> => {
    const store = useTransactionsStore();
    return useQuery<Array<Year>>({
        queryKey: ['years'],
        queryFn: async () => {
            const years = fetchYears()
            store.setYears(await years)
            return years
        },
        refetchOnWindowFocus: false,
    })
}