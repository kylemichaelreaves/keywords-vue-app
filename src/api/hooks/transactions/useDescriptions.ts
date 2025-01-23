import {computed} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import {useQuery} from "@tanstack/vue-query";
import {fetchDescriptions} from "@api/transactions/fetchDescriptions";

export default function useDescriptions() {
    const store = useTransactionsStore();
    const cachedDescriptions = computed(() => store.getDescriptions);
    return useQuery<Array<string>>({
        queryKey: ['descriptions'],
        queryFn: async () => {
            if (cachedDescriptions.value.length > 0) {
                return cachedDescriptions.value;
            } else {
                const descriptions = fetchDescriptions();
                store.setDescriptions(await descriptions);
                return descriptions;
            }
        },
        refetchOnWindowFocus: false,
    });
}