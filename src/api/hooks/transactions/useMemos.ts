import {useQuery} from '@tanstack/vue-query'
import {fetchMemos} from "../../transactions/fetchMemos";
import {Memo} from "../../../types";

export default function useMemos() {
    return useQuery<Array<Memo>>({
        queryKey: ['memos'],
        queryFn: () => fetchMemos(),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
}
