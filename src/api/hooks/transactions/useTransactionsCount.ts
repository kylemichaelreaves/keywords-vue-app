import {useQuery, type UseQueryReturnType} from "@tanstack/vue-query";
import {fetchTransactionsCount} from "@api/transactions/fetchTransactionsCount";
import {useTransactionsStore} from "@stores/transactions";

interface TransactionsCount {
    transactions_count: number;
}

// This hook is used for paginating the TransactionsTable
export default function useTransactionsCount(): UseQueryReturnType<TransactionsCount, Error> {
    const store = useTransactionsStore();
    return useQuery({
        queryKey: ['transactions-count'],
        queryFn: async () => {
            const count = await fetchTransactionsCount();
            store.setTransactionsCount(count);
            return count;
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    })
}