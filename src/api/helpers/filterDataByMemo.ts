import type {Transaction} from "@types";

export default function filterDataByMemo(data: Transaction[], selectedMemo: string): Transaction[] {
    if (selectedMemo) {
        return data.filter((d: Transaction) => d.memo === selectedMemo);
    } else {
        return data;
    }
}