import type {Transaction} from "@types";
import formatDate from "@api/helpers/formatDate";

export default function isDateSameAsPrevious(currentDate: string, index: number, tableData: Transaction[]) {
    if (index === 0) return false;
    const previousDate = tableData[index - 1].date;
    return formatDate(currentDate) === formatDate(previousDate);
};
