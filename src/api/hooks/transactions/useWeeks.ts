import {useQuery} from "@tanstack/vue-query";
import {fetchWeeks} from "../../transactions/fetchWeeks";
import {WeekYear} from "../../../types";

export default function useWeeks() {
    return useQuery<Array<WeekYear>>(
        ['weeks'],
        () => fetchWeeks(),{
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}
