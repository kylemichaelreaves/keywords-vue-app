import {useQuery} from '@tanstack/vue-query'
import type {Memo} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import {fetchMemo} from "@api/transactions/fetchMemo";

// The purpose of this hook is to check its presence in the Memos table
export default function useMemo(): UseQueryReturnType<Memo, Error> {
    const store = useTransactionsStore()
    const selectedMemo = computed(() => store.getSelectedMemo)

    const queryKeyText = computed(() => ['memo', selectedMemo.value])

    return useQuery<Memo>({
        queryKey: queryKeyText.value,
        queryFn: () => fetchMemo(selectedMemo.value),
        refetchOnWindowFocus: false,
        enabled: !!selectedMemo.value
    })
}
