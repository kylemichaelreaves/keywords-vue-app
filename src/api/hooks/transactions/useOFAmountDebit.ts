import { useQuery } from '@tanstack/vue-query';
import type { UseQueryReturnType } from '@tanstack/vue-query';
import { fetchOFAmountDebit } from '@api/transactions/fetchOFAmountDebit';
import { getDateTypeAndValue } from '@components/transactions/getDateTypeAndValue';
import { parseDateIWIYYY } from '@api/helpers/parseDateIWIYYY';
import { parseDateMMYYYY } from '@api/helpers/parseDateMMYYYY';
import type {OFSummary} from '@types';
import { computed } from 'vue';

// Get the Amount Debit for Memo's fitting the OF category, for a certain period of time
export default function useOFAmountDebit(): UseQueryReturnType<OFSummary, Error> {
    // Use the helper function to get the date type and selected value
    const { dateType, selectedValue } = getDateTypeAndValue();

    // Create a queryKey based on the determined date type and selected value
    const queryKey = computed(() => ['OFAmountDebit', dateType, selectedValue?.value]);

    return useQuery<OFSummary>({
        queryKey: queryKey.value,
        queryFn: () => {
            // Determine the date object based on the date type
            let dateObj: Date | null = null;
            if (dateType === "week" && selectedValue) {
                dateObj = parseDateIWIYYY(selectedValue.value);
            } else if (dateType === "month" && selectedValue) {
                dateObj = parseDateMMYYYY(selectedValue.value);
            }

            // Ensure valid date object is passed
            if (!dateObj) {
                throw new Error("Invalid date");
            }

            // Fetch the OF Amount Debit using the determined time frame and date object
            return fetchOFAmountDebit(dateType, dateObj);
        },
        refetchOnWindowFocus: false,
        enabled: !!selectedValue // Enable query only when there is a valid selected value
    });
}
