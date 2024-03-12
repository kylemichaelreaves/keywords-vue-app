// New function to determine the date object based on the dateType and the selected value
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";

export function getDateObject(dateType: string | undefined, selectedValue: string | null) {
    let dateObj;
    if (dateType === "week") {
        dateObj = selectedValue ? parseDateIWIYYY(selectedValue) : null;
    } else if (dateType === "month") {
        dateObj = selectedValue ? parseDateMMYYYY(selectedValue) : null;
    } else if (dateType === "day") {
        dateObj = selectedValue ? new Date(selectedValue) : null;
    }
    // TODO - include a case for dateType === "year"
    return dateObj;
}