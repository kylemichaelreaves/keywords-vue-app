import {useQuery} from "@tanstack/vue-query";
import {useTransactionsStore} from "@stores/transactions";
import {fetchTransactionsCount} from "@api/transactions/fetchTransactionsCount";


// This hook is used for paginating the TransactionsTable
export default function useTransactionsCount() {
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