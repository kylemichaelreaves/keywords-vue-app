import {defineStore} from 'pinia'
import {Transaction} from "../types";

export const useTransactionsStore = defineStore('transactions', {

    state: () => ({
        transactions: [] as Transaction[],
        LIMIT: 100,
        OFFSET: 0,
        date: '',
        selectedMonth: '',
        selectedMemo: '',
    }),
    getters: {
        getSelectedMonth: (state) => {
            return state.selectedMonth
        },
        getSelectedMemo: (state) => {
            return state.selectedMemo
        }
    },
    actions: {
        setTransactions(transactions: Transaction[]) {
            this.transactions = transactions
        },
        setSelectedMonth(selectedMonth: string) {
            this.selectedMonth = selectedMonth
        },
        setSelectedMemo(selectedMemo: string) {
            this.selectedMemo = selectedMemo
        }
    }
})