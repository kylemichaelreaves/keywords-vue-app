import {defineStore} from 'pinia'
import {Transaction} from "../types";
import {fetchTransactions} from "../api/transactions/fetchTransactions";

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
        getTransactions: async (state) => {
            await fetchTransactions(state.LIMIT, state.OFFSET, state.date)
                .then(response => {
                    console.log('response:', response)
                    state.transactions = response
                }).catch(err => {
                    throw err
                })
        },
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