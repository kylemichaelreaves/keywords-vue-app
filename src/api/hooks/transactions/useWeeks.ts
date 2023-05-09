import {useQuery} from "@tanstack/vue-query";
import {fetchWeeks} from "../../transactions/fetchWeeks";
import {Week} from "../../../types";

export default function useWeeks() {
    return useQuery<Array<Week>>({
        queryKey: ['weeks'],
        queryFn: () => fetchWeeks(),
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}
