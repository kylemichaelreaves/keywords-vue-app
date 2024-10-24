// New function to determine the date object based on the dateType and the selected value
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import type {ComputedRef} from "vue";

// Function to determine the date object based on the dateType and its selected value
export function getJSDateObject(dateType: string, selectedValue: ComputedRef<string> | null) {
    if (!selectedValue) {
        return null;
    }

    switch (dateType) {
        case "week":
            return parseDateIWIYYY(selectedValue.value);

        case "month":
            return parseDateMMYYYY(selectedValue.value);

        case "day":
            return new Date(selectedValue.value);

        case "year":

            return new Date(selectedValue.value).getFullYear();

        default:
            return;
    }
}