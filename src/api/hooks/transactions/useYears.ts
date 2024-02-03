import { useQuery } from '@tanstack/vue-query';
import type { UseQueryReturnType } from '@tanstack/vue-query';
import type { Year } from "@types";
import { fetchYears } from "@api/transactions/fetchYears";
import {useTransactionsStore} from "@stores/transactions";

export const useYears = (): UseQueryReturnType<Year[], Error> => {
    const store = useTransactionsStore();
    const selectedYear = store.getSelectedYear;

    return useQuery<Array<Year>>({
        queryKey: ['years'],
        queryFn: () => fetchYears(),
        refetchOnWindowFocus: false,
    })
}