// useMemosByDate.ts
import { computed, ComputedRef } from "vue";
import {Transaction} from "../../../types";

interface MemoAmount {
    memo: string;
    amount: number;
}

/**
 * Returns an array of objects, each with a date and a list of memos for that date.
 * Each memo has an amount value that is the total of all transactions with the same memo and date.
 *
 * @returns {ComputedRef<Array<{date: string, memos: Array<{memo: string, amount: number}>}>>}
 */

export function useMemosByDate(transactions: ComputedRef<Transaction[]>): ComputedRef<Record<string, MemoAmount[]>> {
    return computed(() => {
        const data = transactions.value;
        const memoGroups: Record<string, MemoAmount[]> = data.reduce((acc, cur) => {
            const date = cur.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            const memo = cur.memo;
            if (memo !== '') {
                const amount = parseFloat(cur['amountDebit']) || 0;
                const memoIndex = acc[date].findIndex((m) => m.memo === memo);
                if (memoIndex === -1) {
                    acc[date].push({memo, amount});
                } else {
                    acc[date][memoIndex].amount += amount;
                }
            }
            return acc;
        }, {} as Record<string, MemoAmount[]>);
        return memoGroups;
    });
}

