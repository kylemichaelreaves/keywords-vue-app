import { defineStore } from 'pinia'
import {Transaction} from "../types";

export const useTransactionsStore = defineStore('transactions',{
    state: () => ({
        transactions: [] as Transaction[],
    }),
    getters: {
        getTransactions: (state) => state.transactions,
    },
    actions: {
        setTransactions(transactions: Transaction[]) {
            this.transactions = transactions
        }
    }
})