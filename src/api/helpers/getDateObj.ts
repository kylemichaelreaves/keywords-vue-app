import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import type {ComputedRef} from "vue";

// Function to determine the date object based on the dateType and its selected value
export function getDateObject(dateType: string, selectedValue: ComputedRef<string> | null) {
    if (!selectedValue) {
        return null; // Return early if selectedValue is null or undefined
    }

    switch (dateType) {
        case "week":
            return parseDateIWIYYY(selectedValue.value);

        case "month":
            return parseDateMMYYYY(selectedValue.value);

        case "day":
            return new Date(selectedValue.value);

        case "year":

            return isNaN(new Date(selectedValue.value).getFullYear()) ? null : String(new Date(selectedValue.value).getFullYear());

        default:
            return;
    }
}